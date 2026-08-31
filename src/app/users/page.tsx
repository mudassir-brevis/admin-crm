'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminApi } from '../../lib/api';
import { User, Role, RoleName } from '@crm/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create User Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password@123');
  const [roleId, setRoleId] = useState<number | ''>('');
  const [managerId, setManagerId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await adminApi.get('/roles');
      if (res.data.success) {
        setRoles(res.data.data);
        if (res.data.data.length > 0) setRoleId(res.data.data[0].id);
      }
    } catch (e) {
      //
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) {
      alert('Please select a valid role.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    // Clean phone number: remove all non-digits
    const cleanPhoneDigits = phone.replace(/[^0-9]/g, '');
    if (!cleanPhoneDigits || cleanPhoneDigits.length < 7 || cleanPhoneDigits.length > 14) {
      setErrorMessage('Please enter a valid phone number (7 to 14 digits).');
      setIsSubmitting(false);
      return;
    }

    const fullPhoneNumber = `${countryCode}${cleanPhoneDigits}`;

    try {
      await adminApi.post('/users', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: fullPhoneNumber,
        password,
        role_id: Number(roleId),
        manager_id: managerId ? Number(managerId) : undefined,
      });
      alert('User created successfully!');
      setIsCreateOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('Password@123');
      setErrorMessage(null);
      fetchUsers();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const details = errorData.errors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
        setErrorMessage(`Validation failed:\n${details}`);
        alert(`Validation Error:\n${details}`);
      } else {
        const msg = errorData?.message || 'Failed to create user';
        setErrorMessage(msg);
        alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminApi.patch(`/users/${user.id}`, { status: newStatus });
      fetchUsers();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const managers = users.filter((u) => u.role?.name === RoleName.MANAGER || u.role?.name === RoleName.ADMIN);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="User Accounts & Team Hierarchy" subtitle="Manage sales managers, telecallers, and executives" />

        <div className="page-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Users Directory ({users.length})</h2>
            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
              + Add User
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Reporting Manager</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-medium">{u.role?.name}</span>
                    </td>
                    <td>
                      {u.manager ? <div>👤 {u.manager.name}</div> : <span style={{ color: 'var(--text-muted)' }}>Top Level</span>}
                    </td>
                    <td>{u.phone}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-won' : 'badge-lost'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 style={{ marginBottom: '4px' }}>Add System User</h2>
            <p style={{ marginBottom: '20px' }}>Create an employee profile and assign their reporting line.</p>

            {errorMessage && (
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
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    placeholder="ramesh@crm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      className="form-select"
                      style={{ width: '85px', padding: '8px 4px', flexShrink: 0 }}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select
                    className="form-select"
                    value={roleId}
                    onChange={(e) => setRoleId(Number(e.target.value))}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reporting Manager</label>
                  <select
                    className="form-select"
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">None (Top Level)</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role?.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input
                  type="text"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
