import React from 'react';

interface FunnelStage {
  statusName: string;
  stage: string;
  count: number;
}

interface Props {
  stages: FunnelStage[];
}

export const FunnelChart: React.FC<Props> = ({ stages }) => {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  const colors = [
    '#3B82F6', // NEW
    '#6366F1', // ASSIGNED
    '#0EA5E9', // CONTACTED
    '#06B6D4', // INTERESTED
    '#8B5CF6', // QUALIFIED
    '#EC4899', // MEETING
    '#F59E0B', // PROPOSAL
    '#10B981', // WON
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Lead Conversion Funnel</h3>
      <div style={styles.funnelList}>
        {stages.map((stage, idx) => {
          const widthPercent = Math.max(8, Math.round((stage.count / maxCount) * 100));
          const color = colors[idx % colors.length];

          return (
            <div key={stage.statusName} style={styles.stageRow}>
              <div style={styles.stageLabel}>
                <span style={styles.stageName}>{stage.statusName.replace(/_/g, ' ')}</span>
                <span style={styles.stageCount}>{stage.count}</span>
              </div>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${widthPercent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '20px',
    color: 'var(--text-primary)',
  },
  funnelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  stageRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  stageLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  stageName: {
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  stageCount: {
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  barTrack: {
    height: '10px',
    backgroundColor: 'var(--bg-surface-elevated)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.5s ease',
  },
};
