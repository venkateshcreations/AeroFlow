'use client';

import { useState } from 'react';
import { theme } from '@/lib/theme';

interface SeatMapProps {
  onSeatSelect?: (seats: string[]) => void;
}

export function SeatMap({ onSeatSelect }: SeatMapProps) {
  const [selected, setSelected] = useState<string[]>(['12A']);
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const cols = ['A', 'B', 'C', '', 'D', 'E', 'F'];
  const occupied = ['1A', '1B', '2C', '3A', '4B', '5C', '6A', '7B', '8F', '2A', '3F', '9C', '10A', '11B'];

  const toggle = (seatId: string) => {
    if (occupied.includes(seatId)) return;
    const next = selected.includes(seatId)
      ? selected.filter((s) => s !== seatId)
      : [...selected, seatId];
    setSelected(next);
    onSeatSelect?.(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        {[
          { color: theme.success, label: 'Available' },
          { color: theme.primary, label: 'Selected' },
          { color: '#ccc',        label: 'Occupied'  },
        ].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: theme.textMid }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Aircraft nose */}
      <div style={{ background: `${theme.dark}10`, borderRadius: 8, padding: '6px 32px', marginBottom: 8, fontSize: 12, color: theme.textMid }}>
        🛫 Front of Aircraft
      </div>

      {/* Seat grid */}
      {rows.map((row) => (
        <div key={row} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: theme.textLight, width: 20, textAlign: 'right' }}>{row}</span>
          {cols.map((col, ci) =>
            col === '' ? (
              <div key={ci} style={{ width: 10 }} />
            ) : (
              <button
                key={col}
                onClick={() => toggle(`${row}${col}`)}
                style={{
                  width: 32, height: 30, borderRadius: 6, fontSize: 10, fontWeight: 600,
                  border: 'none', cursor: occupied.includes(`${row}${col}`) ? 'not-allowed' : 'pointer',
                  background: occupied.includes(`${row}${col}`)
                    ? '#ddd'
                    : selected.includes(`${row}${col}`)
                    ? theme.primary
                    : `${theme.success}30`,
                  color: selected.includes(`${row}${col}`) ? '#fff' : theme.success,
                  transition: 'all 0.15s',
                }}
              >
                {col}
              </button>
            ),
          )}
        </div>
      ))}

      <div style={{ fontSize: 13, color: theme.textMid, marginTop: 8 }}>
        Selected: <strong>{selected.join(', ')}</strong>
      </div>
    </div>
  );
}

// ─── BOOKING STEPPER ─────────────────────────────────────────────────────────
interface BookingStepperProps {
  steps: string[];
  current: number;
}

export function BookingStepper({ steps, current }: BookingStepperProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'initial' as any }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: i + 1 <= current ? theme.primary : theme.sky,
              color: i + 1 <= current ? '#fff' : theme.textLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: i + 1 < current ? 18 : 13, fontWeight: 700,
              transition: 'all 0.3s',
              border: i + 1 === current ? `3px solid ${theme.accent}` : 'none',
            }}>
              {i + 1 < current ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: 11, color: i + 1 <= current ? theme.primary : theme.textLight, fontWeight: i + 1 === current ? 700 : 400, marginTop: 6, whiteSpace: 'nowrap' }}>
              {step}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i + 1 < current ? `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` : theme.sky, margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  );
}
