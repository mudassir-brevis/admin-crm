'use client';

import React from 'react';
import { useAuth } from '../lib/authContext';

interface Props {
  title: string;
  subtitle?: string;
}

export const Navbar: React.FC<Props> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      <div style={styles.rightActions}>
        <div style={styles.statusPill}>
          <span style={styles.liveDot} />
          <span>System Online</span>
        </div>

        <button style={styles.logoutBtn} onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    padding: '16px 32px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--success)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--success)',
  },
  logoutBtn: {
    backgroundColor: 'var(--bg-surface-elevated)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-primary)',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
  },
};
