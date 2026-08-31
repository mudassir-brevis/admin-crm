'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminApi } from '../../lib/api';
import { LeadImportRow, LeadImportResult, RoleName, User } from '@crm/types';

const SAMPLE_CSV = `name,company,phone,email,city,source,expected_value
Ratan Tata,Tata Sons Ventures,+919911223344,ratan@tatasons.com,Mumbai,Website,500000
Narayana Murthy,Infosys Foundation,+919922334455,nmurthy@infosys.com,Bengaluru,Referral,750000
Azim Premji,Wipro Enterprises,+919933445566,premji@wipro.com,Bengaluru,Partner,600000
Duplicate Test,Tata Sons Ventures,+919911223344,dup@tatasons.com,Mumbai,Website,300000`;

const SAMPLE_TSV = `name\tcompany\tphone\temail\tcity\tsource\texpected_value
Zaitoon Restaurant, Vellore\tZaitoon Restaurant, Vellore\t919087111211\t\tVellore\tGoogle Maps\t
SAVARA Restaurant\tSAVARA Restaurant\t\t\tVellore\tGoogle Maps\t
Amirtha fine dining\tAmirtha fine dining\t919047139999\t\tVellore\tGoogle Maps\t
Alankar's Virundhu\tAlankar's Virundhu\t918668099895\t\tVellore\tGoogle Maps\t
The Vellore Kitchen | Gandhi Nagar\tThe Vellore Kitchen | Gandhi Nagar\t917092023331\t\tVellore\tGoogle Maps\t
Andhra Spice Restaurant\tAndhra Spice Restaurant\t918122289998\t\tVellore\tGoogle Maps\t
Abhiruchi Multicuisine Family Restaurant\tAbhiruchi Multicuisine Family Restaurant\t919629877788\t\tVellore\tGoogle Maps\t`;

const HEADER_ALIASES: Record<string, string> = {
  name: 'name',
  contact: 'name',
  contact_name: 'name',
  lead_name: 'name',
  person: 'name',
  full_name: 'name',
  customer_name: 'name',
  restaurant_name: 'name',
  business_name: 'name',

  company: 'company',
  company_name: 'company',
  business: 'company',
  organization: 'company',
  firm: 'company',
  store: 'company',

  phone: 'phone',
  mobile: 'phone',
  tel: 'phone',
  phone_number: 'phone',
  contact_no: 'phone',
  contact_number: 'phone',
  mobile_number: 'phone',
  cell: 'phone',

  email: 'email',
  email_id: 'email',
  mail: 'email',
  'e-mail': 'email',

  city: 'city',
  location: 'city',
  town: 'city',
  district: 'city',

  state: 'state',
  province: 'state',
  region: 'state',

  source: 'source',
  lead_source: 'source',
  origin: 'source',

  expected_value: 'expected_value',
  value: 'expected_value',
  deal_value: 'expected_value',
  budget: 'expected_value',
  amount: 'expected_value',

  designation: 'designation',
  title: 'designation',
  role: 'designation',

  industry: 'industry',
  category: 'industry',

  website: 'website',
  web: 'website',
  url: 'website',

  address: 'address',
  street: 'address',

  description: 'description',
  notes: 'description',
  note: 'description',
  remarks: 'description',

  alternate_phone: 'alternate_phone',
  alt_phone: 'alternate_phone',
  secondary_phone: 'alternate_phone',
};

function splitLine(line: string, delimiter: string): string[] {
  if (delimiter === '\t') {
    return line.split('\t').map((val) => {
      let v = val.trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1).trim();
      }
      return v;
    });
  }

  // Comma or Semicolon CSV parsing respecting quotes
  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
    } else if (inQuotes && char === quoteChar) {
      if (line[i + 1] === quoteChar) {
        current += quoteChar;
        i++; // skip escaped quote
      } else {
        inQuotes = false;
        quoteChar = '';
      }
    } else if (!inQuotes && (char === delimiter || (delimiter === ',' && char === ';'))) {
      tokens.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  tokens.push(current.trim());

  return tokens.map((val) => {
    let v = val.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1).trim();
    }
    return v;
  });
}

export default function ImportsPage() {
  const [csvText, setCsvText] = useState(SAMPLE_TSV);
  const [duplicateHandling, setDuplicateHandling] = useState<'SKIP' | 'FAIL'>('SKIP');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<LeadImportResult | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<'NONE' | 'SPECIFIC' | 'ROUND_ROBIN'>('NONE');
  const [selectedTelecallerId, setSelectedTelecallerId] = useState('');
  const [telecallers, setTelecallers] = useState<User[]>([]);

  useEffect(() => {
    const loadTelecallers = async () => {
      try {
        const response = await adminApi.get('/users?limit=100&status=ACTIVE');
        if (response.data.success) {
          setTelecallers(
            response.data.data.filter((candidate: User) => candidate.role?.name === RoleName.TELECALLER)
          );
        }
      } catch {
        setErrorBanner('Could not load active telecallers. Imports without assignment are still available.');
      }
    };

    void loadTelecallers();
  }, []);

  // Live parsed dataset analysis
  const parseResult = useMemo(() => {
    if (!csvText || !csvText.trim()) {
      return {
        rows: [],
        delimiter: ',',
        delimiterName: 'Empty',
        headers: [],
        validCount: 0,
        missingPhoneCount: 0,
      };
    }

    const cleanText = csvText.replace(/^\uFEFF/, '').trim();
    const rawLines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (rawLines.length === 0) {
      return {
        rows: [],
        delimiter: ',',
        delimiterName: 'Empty',
        headers: [],
        validCount: 0,
        missingPhoneCount: 0,
      };
    }

    // Determine Delimiter by inspecting the first line
    const firstLine = rawLines[0];
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;

    let delimiter = ',';
    let delimiterName = 'CSV (Comma-Separated)';
    if (tabCount > 0 && tabCount >= commaCount) {
      delimiter = '\t';
      delimiterName = 'TSV (Tab-Separated / Google Sheets / Excel)';
    } else if (semicolonCount > commaCount) {
      delimiter = ';';
      delimiterName = 'DSV (Semicolon-Separated)';
    }

    // Extract headers
    const rawHeaders = splitLine(firstLine, delimiter).map((h) => h.toLowerCase().trim());
    const canonicalHeaders = rawHeaders.map((h) => HEADER_ALIASES[h] || h);

    const rows: LeadImportRow[] = [];
    let validCount = 0;
    let missingPhoneCount = 0;

    for (let i = 1; i < rawLines.length; i++) {
      const values = splitLine(rawLines[i], delimiter);
      if (values.length === 0 || values.every((v) => !v)) continue;

      const rowObj: any = {};
      canonicalHeaders.forEach((headerKey, idx) => {
        if (values[idx] !== undefined) {
          rowObj[headerKey] = values[idx];
        }
      });

      const rawName = (rowObj.name || '').trim();
      const rawCompany = (rowObj.company || '').trim();
      const name = rawName || rawCompany;
      const company = rawCompany || rawName;

      const rawPhone = (rowObj.phone || '').trim();
      const cleanPhone = rawPhone.replace(/[\s\-\(\)\.]/g, '');

      const rawEmail = (rowObj.email || '').trim().toLowerCase();
      const email = rawEmail || undefined;

      const expectedValue = rowObj.expected_value ? Number(rowObj.expected_value) : 0;

      if (cleanPhone) {
        validCount++;
      } else {
        missingPhoneCount++;
      }

      rows.push({
        name,
        company,
        phone: cleanPhone,
        email,
        city: rowObj.city?.trim() || undefined,
        state: rowObj.state?.trim() || undefined,
        source: rowObj.source?.trim() || 'Google Maps',
        expected_value: isNaN(expectedValue) ? 0 : expectedValue,
        description: rowObj.description?.trim() || undefined,
      });
    }

    return {
      rows,
      delimiter,
      delimiterName,
      headers: canonicalHeaders,
      validCount,
      missingPhoneCount,
    };
  }, [csvText]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    setErrorBanner(null);

    try {
      if (parseResult.rows.length === 0) {
        setErrorBanner('No valid rows found in data. Please check column headers (name, company, phone).');
        setIsProcessing(false);
        return;
      }

      const res = await adminApi.post('/imports/leads', {
        duplicateHandling,
        leads: parseResult.rows,
        assignmentMode,
        telecallerIds:
          assignmentMode === 'SPECIFIC'
            ? [Number(selectedTelecallerId)]
            : assignmentMode === 'ROUND_ROBIN'
              ? telecallers.map((telecaller) => telecaller.id)
              : [],
      });

      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      console.error('Import request error:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors &&
          err.response.data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')) ||
        'Import failed. Please check your data format.';
      setErrorBanner(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar
          title="Bulk Lead Import Engine"
          subtitle="Enterprise-grade batch ingestion with multi-format TSV/CSV auto-detection and duplicate prevention"
        />

        <div className="page-body">
          {errorBanner && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--danger)',
                color: '#FCA5A5',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong>⚠️ Import Error:</strong> {errorBanner}
              </div>
              <button
                onClick={() => setErrorBanner(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FCA5A5',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
            {/* Left Column: Form & Live Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0 }}>Lead Data Ingestion</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                      onClick={() => setCsvText(SAMPLE_TSV)}
                    >
                      Sample TSV (Google Maps)
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                      onClick={() => setCsvText(SAMPLE_CSV)}
                    >
                      Sample CSV
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                      onClick={() => setCsvText('')}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <p style={{ marginBottom: '14px', fontSize: '13px' }}>
                  Paste raw spreadsheet data (TSV) or comma-separated CSV. Columns supported:{' '}
                  <code>name</code>, <code>company</code>, <code>phone</code>, <code>email</code>, <code>city</code>, <code>source</code>, <code>expected_value</code>
                </p>

                <form onSubmit={handleImport}>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Data Stream Input</span>
                      <span className="badge badge-medium">{parseResult.delimiterName}</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={12}
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        whiteSpace: 'pre',
                        overflowX: 'auto',
                        lineHeight: '1.4',
                      }}
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder="Paste your CSV or TSV text here..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duplicate Detection Strategy</label>
                    <select
                      className="form-select"
                      value={duplicateHandling}
                      onChange={(e) => setDuplicateHandling(e.target.value as any)}
                    >
                      <option value="SKIP">SKIP (Recommended) — Safely skip duplicate contacts & ingest fresh leads</option>
                      <option value="FAIL">FAIL — Abort and reject duplicate records</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assign Imported Leads</label>
                    <select
                      className="form-select"
                      value={assignmentMode}
                      onChange={(e) => setAssignmentMode(e.target.value as typeof assignmentMode)}
                    >
                      <option value="NONE">Do not assign — keep leads in the unassigned pool</option>
                      <option value="ROUND_ROBIN" disabled={telecallers.length === 0}>
                        Round robin — distribute evenly across all active telecallers
                      </option>
                      <option value="SPECIFIC" disabled={telecallers.length === 0}>
                        Specific telecaller — assign the whole import to one person
                      </option>
                    </select>
                    {telecallers.length === 0 && (
                      <div style={{ marginTop: '6px', color: 'var(--warning)', fontSize: '12px' }}>
                        No active telecallers are currently available.
                      </div>
                    )}
                  </div>

                  {assignmentMode === 'SPECIFIC' && (
                    <div className="form-group">
                      <label className="form-label">Telecaller</label>
                      <select
                        className="form-select"
                        value={selectedTelecallerId}
                        onChange={(e) => setSelectedTelecallerId(e.target.value)}
                        required
                      >
                        <option value="">Select an active telecaller</option>
                        {telecallers.map((telecaller) => (
                          <option key={telecaller.id} value={telecaller.id}>
                            {telecaller.name} — {telecaller.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontWeight: 700 }}
                    disabled={
                      isProcessing ||
                      parseResult.rows.length === 0 ||
                      (assignmentMode === 'SPECIFIC' && !selectedTelecallerId)
                    }
                  >
                    {isProcessing
                      ? '⚡ Ingesting & Scoring Batch in CRM...'
                      : `🚀 Ingest ${parseResult.rows.length} Leads into CRM`}
                  </button>
                </form>
              </div>

              {/* Real-time Parser Preview */}
              {parseResult.rows.length > 0 && (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '15px', margin: 0 }}>📊 Live Stream Parsing Preview</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="badge badge-won">{parseResult.validCount} Ready with Phone</span>
                      {parseResult.missingPhoneCount > 0 && (
                        <span className="badge badge-urgent">{parseResult.missingPhoneCount} Missing Phone</span>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', marginBottom: '12px' }}>
                    Showing first {Math.min(parseResult.rows.length, 5)} of {parseResult.rows.length} detected records:
                  </p>

                  <div className="table-container" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    <table className="table" style={{ fontSize: '11px' }}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Company / Name</th>
                          <th>Phone</th>
                          <th>City</th>
                          <th>Source</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.rows.slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.company || row.name}</td>
                            <td style={{ color: row.phone ? 'var(--primary-light)' : 'var(--danger)', fontFamily: 'monospace' }}>
                              {row.phone || '(No Phone)'}
                            </td>
                            <td>{row.city || '—'}</td>
                            <td>
                              <span className="badge badge-low">{row.source || 'Import'}</span>
                            </td>
                            <td>
                              {row.phone ? (
                                <span className="badge badge-won">Ready</span>
                              ) : (
                                <span className="badge badge-urgent">Will Skip (No Phone)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Execution Report Card */}
            <div className="card" style={{ height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Import Execution Report</h3>
                {result && (
                  <Link href="/leads" className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>
                    View Leads in CRM →
                  </Link>
                )}
              </div>

              {!result ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📥</div>
                  <h4 style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>No Batch Executed Yet</h4>
                  <p style={{ fontSize: '13px' }}>
                    Paste your lead list on the left and click <strong>Ingest Leads</strong>. The engine will parse columns, clean phone numbers, auto-create sources, detect duplicates, and score leads.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="kpi-grid" style={{ marginBottom: '20px' }}>
                    <div className="card" style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL ROWS</div>
                      <div style={{ fontSize: '26px', fontWeight: 800 }}>{result.totalRows}</div>
                    </div>
                    <div className="card" style={{ padding: '14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700 }}>SUCCESSFUL</div>
                      <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--success)' }}>{result.successful}</div>
                    </div>
                    <div className="card" style={{ padding: '14px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 700 }}>DUPLICATES</div>
                      <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--warning)' }}>{result.duplicates}</div>
                    </div>
                    <div className="card" style={{ padding: '14px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 700 }}>FAILED / SKIPPED</div>
                      <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--danger)' }}>{result.failed}</div>
                    </div>
                  </div>

                  {result.successful > 0 && (
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                          ✅ Ingested {result.successful} fresh leads into CRM!
                        </span>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Lead codes generated, initial scores calculated, and audit logs recorded.
                        </div>
                      </div>
                      <Link href="/leads" className="btn btn-success" style={{ fontSize: '12px', padding: '6px 14px' }}>
                        Open Leads
                      </Link>
                    </div>
                  )}

                  {result.assigned > 0 && (
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--primary-light)', marginBottom: '6px' }}>
                        Assigned {result.assigned} imported leads
                      </div>
                      {result.assignmentSummary.map((item) => (
                        <div key={item.telecallerId} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {item.telecallerName}: {item.leadCount} lead{item.leadCount === 1 ? '' : 's'}
                        </div>
                      ))}
                    </div>
                  )}

                  {result.duplicateDetails.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ color: 'var(--warning)', fontSize: '13px', marginBottom: '8px' }}>
                        ⚠️ Detected Duplicates ({result.duplicateDetails.length}):
                      </h4>
                      <div className="table-container" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        <table className="table" style={{ fontSize: '11px' }}>
                          <thead>
                            <tr>
                              <th>Row</th>
                              <th>Company</th>
                              <th>Phone</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.duplicateDetails.map((dup, idx) => (
                              <tr key={idx}>
                                <td>#{dup.row}</td>
                                <td>{dup.company}</td>
                                <td style={{ fontFamily: 'monospace' }}>{dup.phone || '—'}</td>
                                <td style={{ color: 'var(--warning)' }}>{dup.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {result.errors.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '8px' }}>
                        ❌ Incomplete / Failed Rows ({result.errors.length}):
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          maxHeight: '220px',
                          overflowY: 'auto',
                        }}
                      >
                        {result.errors.map((err, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: '12px',
                              color: 'var(--danger)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <strong>Row #{err.row}:</strong> {err.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
