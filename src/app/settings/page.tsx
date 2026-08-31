'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminApi } from '../../lib/api';

export default function SettingsPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [newSourceName, setNewSourceName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [srcRes, stRes] = await Promise.all([
        adminApi.get('/lead-sources'),
        adminApi.get('/lead-statuses'),
      ]);
      if (srcRes.data.success) setSources(srcRes.data.data);
      if (stRes.data.success) setStatuses(stRes.data.data);
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    try {
      await adminApi.post('/lead-sources', { name: newSourceName.trim() });
      setNewSourceName('');
      fetchData();
    } catch (err) {
      alert('Failed to add lead source');
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="System Settings & Metadata Configuration" subtitle="Configure lead sources, status pipelines, scoring models, and rules" />

        <div className="page-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Lead Sources Card */}
            <div className="card">
              <h3 style={{ marginBottom: '14px' }}>Lead Channels & Marketing Sources</h3>
              <form onSubmit={handleAddSource} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="New source channel (e.g. LinkedIn Ads)"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  + Add Source
                </button>
              </form>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Source Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((src) => (
                      <tr key={src.id}>
                        <td>#{src.id}</td>
                        <td style={{ fontWeight: 600 }}>{src.name}</td>
                        <td><span className="badge badge-won">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lead Pipeline Stages */}
            <div className="card">
              <h3 style={{ marginBottom: '14px' }}>Lead Lifecycle Statuses & Sorting</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Status Key</th>
                      <th>Lifecycle Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statuses.map((st) => (
                      <tr key={st.id}>
                        <td>#{st.sort_order}</td>
                        <td style={{ fontWeight: 600 }}>{st.name}</td>
                        <td><span className="badge badge-medium">{st.stage}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Scoring Engine Rule Weights */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '14px' }}>Deterministic Lead Scoring Engine Weights (Max: 100 pts)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Decision Maker Identified</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>+20 Points</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>C-level / VP / Director designated</div>
              </div>

              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Budget Confirmed</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>+20 Points</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified procurement budget</div>
              </div>

              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Requirement Confirmed</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>+20 Points</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scoped technical requirements</div>
              </div>

              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Prospect High Interest</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>+15 Points</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Expressed clear purchase timeline</div>
              </div>

              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Meeting Scheduled</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>+10 Points</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Product architecture demo set</div>
              </div>

              <div className="card" style={{ padding: '14px', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Quotation Requested</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>+10 Points</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Formal commercial proposal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
