import React from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  trend?: string;
}

export const MetricCard: React.FC<Props> = ({
  title,
  value,
  subtitle,
  icon = '📈',
  color = 'var(--primary)',
  trend,
}) => {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <span style={styles.icon}>{icon}</span>
      </div>
      <div style={{ ...styles.value, color }}>{value}</div>
      <div style={styles.footer}>
        {trend && <span style={styles.trend}>{trend}</span>}
        {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  icon: {
    fontSize: '20px',
  },
  value: {
    fontSize: '32px',
    fontWeight: 800,
    lineHeight: 1.1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    marginTop: '4px',
  },
  trend: {
    color: 'var(--success)',
    fontWeight: 700,
  },
  subtitle: {
    color: 'var(--text-muted)',
  },
};
