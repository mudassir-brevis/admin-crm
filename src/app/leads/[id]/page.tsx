'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/Sidebar';
import { Navbar } from '../../../components/Navbar';
import { AssignModal } from '../../../components/AssignModal';
import { adminApi } from '../../../lib/api';
import { Lead } from '@crm/types';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id;

  const [lead, setLead] = useState<Lead | null>(null);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACTIVITIES' | 'CALLS' | 'FOLLOWUPS' | 'MEETINGS' | 'OPPORTUNITIES' | 'NOTES'>('OVERVIEW');
  const [isLoading, setIsLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Status Change & Lost Reason State
  const [selectedStatusId, setSelectedStatusId] = useState<number | ''>('');
  const [lostReason, setLostReason] = useState('PRICE');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Quick note state
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    fetchLead();
    fetchStatuses();
  }, [leadId]);

  const fetchLead = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.get(`/leads/${leadId}`);
      if (res.data.success) {
        setLead(res.data.data);
        setSelectedStatusId(res.data.data.status_id);
      }
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await adminApi.get('/lead-statuses');
      if (res.data.success) setStatuses(res.data.data);
    } catch (e) {
      //
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatusId) return;

    setIsUpdatingStatus(true);
    try {
      const payload: any = {
        status_id: Number(selectedStatusId),
        notes: statusNotes,
      };

      const selectedStatusObj = statuses.find((s) => s.id === Number(selectedStatusId));
      if (selectedStatusObj && (selectedStatusObj.name === 'LOST' || selectedStatusObj.name === 'NOT_INTERESTED')) {
        payload.lost_reason = lostReason;
      }

      await adminApi.patch(`/leads/${leadId}/status`, payload);
      alert('Lead status updated successfully!');
      fetchLead();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsAddingNote(true);
    try {
      await adminApi.post(`/leads/${leadId}/notes`, { content: noteContent.trim() });
      setNoteContent('');
      fetchLead();
    } catch (err) {
      alert('Failed to save note');
    } finally {
      setIsAddingNote(false);
    }
  };

  if (isLoading || !lead) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar title="Lead Details" />
          <div className="page-body">
            <p>Loading complete lead 360-degree data...</p>
          </div>
        </div>
      </div>
    );
  }

  const isLostSelected = statuses.find((s) => s.id === Number(selectedStatusId))?.name === 'LOST' ||
    statuses.find((s) => s.id === Number(selectedStatusId))?.name === 'NOT_INTERESTED';

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar
          title={`${lead.lead_code} — ${lead.company?.name || 'Lead'}`}
          subtitle="360° Customer Profile, Calling Log, Meetings, Opportunities, and Audit Trail"
        />

        <div className="page-body">
          {/* Header Summary Banner */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '24px' }}>{lead.company?.name}</h2>
                  <span className="badge badge-medium">{lead.lead_code}</span>
                  <span className="badge badge-high">{lead.priority} Priority</span>
                  <span className="badge badge-won">{lead.status?.name}</span>
                </div>
                <p style={{ marginTop: '4px' }}>
                  👤 {lead.contact?.name} ({lead.contact?.designation || 'Key Decision Maker'}) • 📞 {lead.contact?.phone} • ✉️ {lead.contact?.email}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Expected Deal Value</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)' }}>
                    ₹{Number(lead.expected_value || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => setAssignModalOpen(true)}>
                  Assign Lead
                </button>
              </div>
            </div>

            {/* Score Track */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>
                Lead Score: <span style={{ color: lead.score >= 80 ? 'var(--danger)' : 'var(--primary-light)' }}>{lead.score}/100</span> ({lead.score >= 80 ? 'HOT 🔥' : lead.score >= 50 ? 'WARM ⚡' : 'COLD ❄️'})
              </div>
              <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${lead.score}%`, backgroundColor: lead.score >= 80 ? 'var(--danger)' : 'var(--primary)' }} />
              </div>
            </div>
          </div>

          {/* Lifecycle State Controller & Tabs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            {/* Left Tabs Area */}
            <div>
              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '20px', overflowX: 'auto' }}>
                {(['OVERVIEW', 'ACTIVITIES', 'CALLS', 'FOLLOWUPS', 'MEETINGS', 'OPPORTUNITIES', 'NOTES'] as const).map((t) => (
                  <button
                    key={t}
                    className={`btn ${activeTab === t ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '6px 14px', fontSize: '13px' }}
                    onClick={() => setActiveTab(t)}
                  >
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === 'OVERVIEW' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="card">
                    <h3 style={{ marginBottom: '14px' }}>Contact & Enterprise Profile</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                      <div><strong>Company:</strong> {lead.company?.name}</div>
                      <div><strong>Industry:</strong> {lead.company?.industry || 'N/A'}</div>
                      <div><strong>Contact Person:</strong> {lead.contact?.name}</div>
                      <div><strong>Designation:</strong> {lead.contact?.designation || 'N/A'}</div>
                      <div><strong>Phone Number:</strong> {lead.contact?.phone}</div>
                      <div><strong>Email Address:</strong> {lead.contact?.email || 'N/A'}</div>
                      <div><strong>City / State:</strong> {lead.company?.city}, {lead.company?.state}</div>
                      <div><strong>Lead Source:</strong> {lead.source?.name}</div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 style={{ marginBottom: '14px' }}>Assigned Personnel</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Assigned Telecaller</div>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginTop: '2px' }}>
                          {lead.telecaller ? `🎧 ${lead.telecaller.name} (${lead.telecaller.email})` : 'Unassigned'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Assigned Sales Executive</div>
                        <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginTop: '2px' }}>
                          {lead.executive ? `👔 ${lead.executive.name} (${lead.executive.email})` : 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {lead.customer && (
                    <div className="card" style={{ border: '1px solid var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                      <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>🏆 Converted Active Customer Account</h3>
                      <p><strong>Customer Code:</strong> {lead.customer.customer_code}</p>
                      <p><strong>Account Status:</strong> {lead.customer.status}</p>
                      <p><strong>Total Deal Value:</strong> ₹{Number((lead.customer as any).total_deal_value || lead.expected_value || 0).toLocaleString('en-IN')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVITIES TAB */}
              {activeTab === 'ACTIVITIES' && (
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>Chronological Activity Timeline</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {lead.activities?.map((act) => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid var(--border-color)',
                        }}
                      >
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '6px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary-light)' }}>
                              {act.activity_type.replace(/_/g, ' ')}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {new Date(act.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '2px' }}>{act.description}</p>
                          {act.user && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>By {act.user.name}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CALLS TAB */}
              {activeTab === 'CALLS' && (
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>Call History Logs</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Outcome</th>
                          <th>Duration</th>
                          <th>Notes</th>
                          <th>Called By</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead.call_logs?.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                              No call records found for this lead.
                            </td>
                          </tr>
                        ) : (
                          lead.call_logs?.map((c) => {
                            const mins = Math.floor(c.duration_seconds / 60);
                            const secs = c.duration_seconds % 60;
                            const formattedDuration = mins > 0 ? `${mins}m ${secs.toString().padStart(2, '0')}s (${c.duration_seconds}s)` : `${c.duration_seconds}s`;

                            return (
                              <tr key={c.id}>
                                <td><span className="badge badge-medium">{c.outcome}</span></td>
                                <td style={{ fontWeight: 600 }}>{formattedDuration}</td>
                                <td>{c.notes || '-'}</td>
                                <td>{c.user?.name || 'Telecaller'}</td>
                                <td>{new Date(c.called_at).toLocaleString()}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FOLLOWUPS TAB */}
              {activeTab === 'FOLLOWUPS' && (
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>Follow-up Schedules</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Scheduled For</th>
                          <th>Status</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead.follow_ups?.map((f) => (
                          <tr key={f.id}>
                            <td style={{ fontWeight: 600 }}>⏰ {f.type}</td>
                            <td>{new Date(f.scheduled_at).toLocaleString()}</td>
                            <td>
                              <span className={`badge ${f.status === 'COMPLETED' ? 'badge-won' : f.status === 'OVERDUE' ? 'badge-lost' : 'badge-high'}`}>
                                {f.status}
                              </span>
                            </td>
                            <td>{f.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MEETINGS TAB */}
              {activeTab === 'MEETINGS' && (
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>Client Meetings & Demos</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead.meetings?.map((m) => (
                          <tr key={m.id}>
                            <td style={{ fontWeight: 600 }}>{m.title}</td>
                            <td>{m.meeting_type}</td>
                            <td>{new Date(m.scheduled_at).toLocaleString()}</td>
                            <td><span className="badge badge-won">{m.status}</span></td>
                            <td>{m.location || 'Online'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* OPPORTUNITIES TAB */}
              {activeTab === 'OPPORTUNITIES' && (
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>Opportunities & Proposals</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Deal Name</th>
                          <th>Value</th>
                          <th>Stage</th>
                          <th>Probability</th>
                          <th>Expected Close</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead.opportunities?.map((opp) => (
                          <tr key={opp.id}>
                            <td style={{ fontWeight: 600 }}>{opp.name}</td>
                            <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                              ₹{Number(opp.value || 0).toLocaleString('en-IN')}
                            </td>
                            <td><span className="badge badge-qualified">{opp.stage}</span></td>
                            <td>{opp.probability}%</td>
                            <td>{new Date(opp.expected_close_date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'NOTES' && (
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>Internal Team Notes</h3>
                  <form onSubmit={handleAddNote} style={{ marginBottom: '20px' }}>
                    <div className="form-group">
                      <textarea
                        className="form-textarea"
                        placeholder="Write a confidential note for the sales & management team..."
                        rows={3}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isAddingNote}>
                      {isAddingNote ? 'Saving...' : 'Add Note'}
                    </button>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {lead.notes?.map((n) => (
                      <div key={n.id} style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                        <p style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{n.content}</p>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                          By {n.user?.name || 'User'} on {new Date(n.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Status State Machine Controller Card */}
            <div>
              <div className="card" style={{ position: 'sticky', top: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>Lead Lifecycle Controller</h3>

                <form onSubmit={handleUpdateStatus}>
                  <div className="form-group">
                    <label className="form-label">Move to Lifecycle Stage</label>
                    <select
                      className="form-select"
                      value={selectedStatusId}
                      onChange={(e) => setSelectedStatusId(Number(e.target.value))}
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {isLostSelected && (
                    <div className="form-group">
                      <label className="form-label">Mandatory Lost Reason *</label>
                      <select
                        className="form-select"
                        value={lostReason}
                        onChange={(e) => setLostReason(e.target.value)}
                      >
                        <option value="PRICE">Pricing was too high</option>
                        <option value="COMPETITOR">Chose a competitor</option>
                        <option value="NO_BUDGET">Budget frozen / unapproved</option>
                        <option value="NO_RESPONSE">Ghosted / unresponsive</option>
                        <option value="NOT_INTERESTED">Not interested / wrong fit</option>
                        <option value="OTHER">Other Reason</option>
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Transition Notes</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="Reason or feedback on status transition..."
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '8px' }}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? 'Transitioning...' : 'Update Lead Status'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModalOpen && (
        <AssignModal
          leadId={lead.id}
          leadCode={lead.lead_code}
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onSuccess={fetchLead}
        />
      )}
    </div>
  );
}
