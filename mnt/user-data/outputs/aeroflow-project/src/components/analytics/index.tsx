'use client';

import { theme } from '@/lib/theme';
import { analyticsData } from '@/data/mockData';

export function RevenueBarChart() {
  const max = Math.max(...analyticsData.map((d) => d.revenue));

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 160 }}>
      {analyticsData.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 11, color: theme.textMid, fontWeight: 600 }}>
            ${(d.revenue / 1000).toFixed(0)}K
          </div>
          <div style={{
            width: '100%', borderRadius: '6px 6px 0 0',
            background: `linear-gradient(180deg, ${theme.accent}, ${theme.primary})`,
            height: (d.revenue / max) * 120,
            transition: 'height 0.5s ease', minHeight: 8,
          }} />
          <div style={{ fontSize: 12, color: theme.textLight }}>{d.month}</div>
        </div>
      ))}
    </div>
  );
}

export function BookingsLineChart() {
  const max = Math.max(...analyticsData.map((d) => d.bookings));
  const points = analyticsData.map((d, i) => {
    const x = (i / (analyticsData.length - 1)) * 300;
    const y = 80 - (d.bookings / max) * 70;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" viewBox="0 0 300 90" preserveAspectRatio="none" style={{ height: 100 }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,80 ${points} 300,80`}
        fill="url(#lineGrad)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={theme.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {analyticsData.map((d, i) => {
        const x = (i / (analyticsData.length - 1)) * 300;
        const y = 80 - (d.bookings / max) * 70;
        return <circle key={i} cx={x} cy={y} r="3" fill={theme.accent} />;
      })}
    </svg>
  );
}
