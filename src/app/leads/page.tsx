'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { AssignModal } from '../../components/AssignModal';
import { adminApi } from '../../lib/api';
import { Lead, LeadPriority } from '@crm/types';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');

  // Modals
  const [assignModalLead, setAssignModalLead] = useState<{ id: number; code: string } | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Lead Form
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newCountryCode, setNewCountryCode] = useState('+91');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSourceId, setNewSourceId] = useState<number | ''>('');
  const [newPriority, setNewPriority] = useState<LeadPriority>(LeadPriority.MEDIUM);
  const [newValue, setNewValue] = useState<number>(250000);
  const [isCreating, setIsCreating] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMeta();
    fetchLeads();
  }, [search, selectedStatus, selectedPriority]);

  const fetchMeta = async () => {
    try {
      const [stRes, srcRes] = await Promise.all([
        adminApi.get('/lead-statuses'),
        adminApi.get('/lead-sources'),
      ]);
      if (stRes.data.success) setStatuses(stRes.data.data);
      if (srcRes.data.success) {
        setSources(srcRes.data.data);
        if (srcRes.data.data.length > 0) setNewSourceId(srcRes.data.data[0].id);
      }
    } catch (e) {
      //
    }
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params: any = { limit: 100 };
      if (search) params.search = search;
      if (selectedStatus) params.status_id = selectedStatus;
      if (selectedPriority) params.priority = selectedPriority;

      const res = await adminApi.get('/leads', { params });
      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErrorMessage(null);

    const cleanPhoneDigits = newPhone.replace(/[^0-9]/g, '');
    if (!cleanPhoneDigits || cleanPhoneDigits.length < 7 || cleanPhoneDigits.length > 14) {
      setCreateErrorMessage('Please enter a valid phone number (7 to 14 digits).');
      return;
    }

    const fullPhoneNumber = `${newCountryCode}${cleanPhoneDigits}`;

    setIsCreating(true);
    try {
      await adminApi.post('/leads', {
        company: { name: newCompanyName.trim() },
        contact: {
          name: newContactName.trim(),
          phone: fullPhoneNumber,
          email: newEmail.trim() ? newEmail.trim().toLowerCase() : undefined,
        },
        source_id: Number(newSourceId || 1),
        priority: newPriority,
        expected_value: Number(newValue || 0),
      });
      setCreateModalOpen(false);
      // Reset form
      setNewCompanyName('');
      setNewContactName('');
      setNewPhone('');
      setNewEmail('');
      setCreateErrorMessage(null);
      fetchLeads();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const details = errorData.errors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
        setCreateErrorMessage(`Validation failed:\n${details}`);
        alert(`Validation Error:\n${details}`);
      } else {
        const msg = errorData?.message || 'Failed to create lead';
        setCreateErrorMessage(msg);
        alert(msg);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const getPriorityBadgeClass = (p: string) => {
    switch (p) {
      case 'URGENT': return 'badge-urgent';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getStatusBadgeClass = (s: string) => {
    switch (s) {
      case 'WON': return 'badge-won';
      case 'LOST': return 'badge-lost';
      case 'QUALIFIED': return 'badge-qualified';
      case 'INTERESTED': return 'badge-interested';
      default: return 'badge-medium';
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Leads & Sales Pipeline" subtitle="Manage, qualify and assign sales opportunities across teams" />

        <div className="page-body">
          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            {/* Search & Filters */}
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="🔍 Search company, contact name, phone, code..."
                style={{ maxWidth: '340px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                style={{ maxWidth: '180px' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ maxWidth: '160px' }}
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Right Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                <button
                  className={`btn ${viewMode === 'TABLE' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => setViewMode('TABLE')}
                >
                  Table
                </button>
                <button
                  className={`btn ${viewMode === 'KANBAN' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={() => setViewMode('KANBAN')}
                >
                  Pipeline
                </button>
              </div>

              <button className="btn btn-primary" onClick={() => setCreateModalOpen(true)}>
                + New Lead
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'TABLE' && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Lead Code</th>
                    <th>Company / Contact</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Score</th>
                    <th>Value</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                        No leads found matching query.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <Link href={`/leads/${lead.id}`} style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                            {lead.lead_code}
                          </Link>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{lead.company?.name || 'N/A'}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            👤 {lead.contact?.name} • 📞 {lead.contact?.phone}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(lead.status?.name || 'NEW')}`}>
                            {lead.status?.name || 'NEW'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityBadgeClass(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: lead.score >= 80 ? 'var(--danger)' : lead.score >= 50 ? 'var(--warning)' : 'var(--primary-light)' }}>
                              {lead.score}/100
                            </span>
                            <span style={{ fontSize: '11px' }}>{lead.score >= 80 ? '🔥' : lead.score >= 50 ? '⚡' : '❄️'}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                          ₹{Number(lead.expected_value || 0).toLocaleString('en-IN')}
                        </td>
                        <td style={{ fontSize: '12px' }}>
                          {lead.telecaller && <div>🎧 {lead.telecaller.name}</div>}
                          {lead.executive && <div>👔 {lead.executive.name}</div>}
                          {!lead.telecaller && !lead.executive && <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                              onClick={() => setAssignModalLead({ id: lead.id, code: lead.lead_code })}
                            >
                              Assign
                            </button>
                            <Link href={`/leads/${lead.id}`} className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                              360° View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Kanban Pipeline View */}
          {viewMode === 'KANBAN' && (
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
              {statuses.map((st) => {
                const stageLeads = leads.filter((l) => l.status_id === st.id);
                return (
                  <div
                    key={st.id}
                    style={{
                      minWidth: '280px',
                      maxWidth: '280px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{st.name}</span>
                      <span className="badge badge-medium">{stageLeads.length}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '70vh', overflowY: 'auto' }}>
                      {stageLeads.map((lead) => (
                        <Link
                          key={lead.id}
                          href={`/leads/${lead.id}`}
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-light)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-light)' }}>{lead.lead_code}</span>
                            <span className={`badge ${getPriorityBadgeClass(lead.priority)}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                              {lead.priority}
                            </span>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{lead.company?.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>👤 {lead.contact?.name}</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)', marginTop: '4px' }}>
                            ₹{Number(lead.expected_value || 0).toLocaleString('en-IN')}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModalLead && (
        <AssignModal
          leadId={assignModalLead.id}
          leadCode={assignModalLead.code}
          isOpen={!!assignModalLead}
          onClose={() => setAssignModalLead(null)}
          onSuccess={fetchLeads}
        />
      )}

      {/* Create Lead Modal */}
      {createModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 style={{ marginBottom: '4px' }}>Create New Enterprise Lead</h2>
            <p style={{ marginBottom: '20px' }}>Enter prospect company, contact person, and estimated opportunity details.</p>

            {createErrorMessage && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #ef4444',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                whiteSpace: 'pre-line'
              }}>
                {createErrorMessage}
              </div>
            )}

            <form onSubmit={handleCreateLead}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Reliance Retail Ventures"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Person *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Vikram Merchant"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      className="form-select"
                      style={{ width: '85px', padding: '8px 4px', flexShrink: 0 }}
                      value={newCountryCode}
                      onChange={(e) => setNewCountryCode(e.target.value)}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+966">🇸🇦 +966</option>
                    </select>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ flex: 1 }}
                      required
                      placeholder="9876543210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="vikram@relianceretail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lead Source</label>
                  <select
                    className="form-select"
                    value={newSourceId}
                    onChange={(e) => setNewSourceId(Number(e.target.value))}
                  >
                    {sources.map((src) => (
                      <option key={src.id} value={src.id}>{src.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as LeadPriority)}
                  >
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Expected Deal Value (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={isCreating}
                >
                  {isCreating ? 'Saving...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
