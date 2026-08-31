'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminApi } from '../../lib/api';
import { AuditLog } from '@crm/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [selectedEntity]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params: any = { limit: 50 };
      if (selectedEntity) params.entity_type = selectedEntity;

      const res = await adminApi.get('/audit-logs', { params });
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="System Audit Logs & Security Trail" subtitle="Immutable ledger of all changes, assignments, status transitions, and data events" />

        <div className="page-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select
                className="form-select"
                style={{ width: '220px' }}
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
              >
                <option value="">All Entity Types</option>
                <option value="LEAD">Lead</option>
                <option value="OPPORTUNITY">Opportunity</option>
                <option value="USER">User</option>
                <option value="ROLE">Role</option>
                <option value="PROPOSAL">Proposal</option>
              </select>
            </div>

            <button className="btn btn-secondary" onClick={fetchLogs}>
              🔄 Refresh Stream
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Performed By</th>
                  <th>Diff Inspection</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{log.action}</span>
                      </td>
                      <td>
                        <span className="badge badge-medium">{log.entity_type}</span>
                      </td>
                      <td>#{log.entity_id}</td>
                      <td>👤 {log.user?.name || 'System / Auto'}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => setSelectedLog(log)}
                        >
                          View Diff Payload
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Diff Inspector Modal */}
      {selectedLog && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '750px' }}>
            <h2 style={{ marginBottom: '4px' }}>Audit Log Diff Inspector #{selectedLog.id}</h2>
            <p style={{ marginBottom: '16px' }}>
              Action: <strong>{selectedLog.action}</strong> on <strong>{selectedLog.entity_type} #{selectedLog.entity_id}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '13px', color: 'var(--danger)', marginBottom: '6px' }}>Original State (Old Data)</h4>
                <pre style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '11px', overflow: 'auto', maxHeight: '300px', border: '1px solid var(--border-light)' }}>
                  {JSON.stringify(selectedLog.old_data || {}, null, 2)}
                </pre>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', color: 'var(--success)', marginBottom: '6px' }}>Updated State (New Data)</h4>
                <pre style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '11px', overflow: 'auto', maxHeight: '300px', border: '1px solid var(--border-light)' }}>
                  {JSON.stringify(selectedLog.new_data || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setSelectedLog(null)}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
