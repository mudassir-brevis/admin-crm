'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';
import { User, RoleName } from '@crm/types';

interface Props {
  leadId: number;
  leadCode: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignModal: React.FC<Props> = ({
  leadId,
  leadCode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [assignmentType, setAssignmentType] = useState<'TELECALLER' | 'EXECUTIVE'>('TELECALLER');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRoundRobin, setIsRoundRobin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, assignmentType]);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.get('/users');
      if (res.data.success) {
        const filtered = res.data.data.filter((u: User) =>
          assignmentType === 'TELECALLER'
            ? u.role?.name === RoleName.TELECALLER
            : u.role?.name === RoleName.EXECUTIVE
        );
        setUsers(filtered);
        if (filtered.length > 0) setSelectedUserId(filtered[0].id);
      }
    } catch (err) {
      //
    }
  };

  if (!isOpen) return null;

  const handleAssign = async () => {
    setIsLoading(true);
    try {
      if (isRoundRobin) {
        await adminApi.post(`/leads/${leadId}/round-robin`, { assignment_type: assignmentType });
      } else {
        await adminApi.post(`/leads/${leadId}/assign`, {
          assigned_to: Number(selectedUserId),
          assignment_type: assignmentType,
          notes,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to assign lead.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 style={{ marginBottom: '4px' }}>Assign Lead: {leadCode}</h2>
        <p style={{ marginBottom: '20px' }}>Select an agent or use automated round-robin distribution.</p>

        <div className="form-group">
          <label className="form-label">Role Target</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn ${assignmentType === 'TELECALLER' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setAssignmentType('TELECALLER')}
            >
              🎧 Telecaller
            </button>
            <button
              type="button"
              className={`btn ${assignmentType === 'EXECUTIVE' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setAssignmentType('EXECUTIVE')}
            >
              👔 Sales Executive
            </button>
          </div>
        </div>

        <div className="form-group" style={{ margin: '16px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isRoundRobin}
              onChange={(e) => setIsRoundRobin(e.target.checked)}
            />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Use Automated Round-Robin Balanced Allocation</span>
          </label>
        </div>

        {!isRoundRobin && (
          <div className="form-group">
            <label className="form-label">Select Agent</label>
            {users.length === 0 ? (
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                color: 'var(--warning)',
              }}>
                ⚠️ No active {assignmentType.toLowerCase()}s found. Please create one in <strong>Users & Teams</strong> directory first.
              </div>
            ) : (
              <select
                className="form-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Assignment Notes / Instructions</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Special instructions or customer background..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleAssign}
            disabled={isLoading || (!isRoundRobin && (!selectedUserId || users.length === 0))}
          >
            {isLoading ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};
