'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/authContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Leads', href: '/leads', icon: '👥' },
    { label: 'Users & Teams', href: '/users', icon: '👤' },
    { label: 'Roles & Permissions', href: '/roles', icon: '🛡️' },
    { label: 'CSV Lead Import', href: '/imports', icon: '📥' },
    { label: 'Reports & Funnel', href: '/reports', icon: '📈' },
    { label: 'Audit Logs', href: '/audit-logs', icon: '📜' },
    { label: 'System Settings', href: '/settings', icon: '⚙️' },
  ];

  const roleDisplay = typeof user?.role === 'object' && user?.role !== null
    ? (user.role as any).name
    : user?.role || 'ADMIN';

  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <span style={styles.logoIcon}>⚡</span>
        <div>
          <div style={styles.brandTitle}>ANTIGRAVITY</div>
          <div style={styles.brandSubtitle}>ENTERPRISE CRM</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.navItem,
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#FFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info Footnote */}
      <div style={styles.userBox}>
        <div style={styles.avatar}>{user?.name?.charAt(0) || 'A'}</div>
        <div style={styles.userMeta}>
          <div style={styles.userName}>{user?.name || 'Administrator'}</div>
          <div style={styles.userRole}>{roleDisplay}</div>
        </div>
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  brand: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  logoIcon: {
    fontSize: '28px',
  },
  brandTitle: {
    fontSize: '16px',
    fontWeight: 800,
    letterSpacing: '1px',
    color: 'var(--text-primary)',
  },
  brandSubtitle: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1px',
    color: 'var(--primary-light)',
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    transition: 'all 0.15s ease',
  },
  navIcon: {
    fontSize: '16px',
  },
  userBox: {
    padding: '16px 20px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
  },
  userMeta: {
    minWidth: 0,
  },
  userName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '11px',
    color: 'var(--primary-light)',
    fontWeight: 700,
  },
};
