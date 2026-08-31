'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/authContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@crm.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const ok = await login(email, password);
    if (!ok) {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.brandHeader}>
          <span style={styles.logoIcon}>⚡</span>
          <h2>BREVIS CRM</h2>
          <p>Enterprise Lead & Sales Management Portal</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              placeholder="admin@crm.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-main)',
    padding: '16px',
  },
  card: {
    maxWidth: '420px',
    width: '100%',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    boxShadow: 'var(--shadow-lg)',
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoIcon: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '8px',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    marginBottom: '16px',
  },
  quickFillBox: {
    marginTop: '24px',
    padding: '12px',
    backgroundColor: 'var(--bg-surface-elevated)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-light)',
  },
  quickFillTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  quickFillBtns: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
};
