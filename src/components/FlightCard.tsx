'use client';

import { theme } from '@/lib/theme';
import { Card, Btn, CO2Badge, PricePredictionBadge, Badge } from '@/components/ui';
import type { Flight } from '@/data/mockData';

export function FlightCard({
  flight, onSelect, selected,
}: { flight: Flight; onSelect?: (f: Flight) => void; selected?: boolean }) {
  return (
    <Card
      style={{ padding: 20, border: selected ? `2px solid ${theme.accent}` : '1px solid rgba(15,76,138,0.06)', cursor: 'pointer' }}
      onClick={() => onSelect?.(flight)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {/* Airline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${theme.primary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            {flight.logo}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{flight.airline}</div>
            <div style={{ fontSize: 12, color: theme.textLight }}>✦ {flight.rating} · {flight.class}</div>
          </div>
        </div>

        {/* Route & Times */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: theme.text, letterSpacing: -1 }}>{flight.dep}</div>
            <div style={{ fontSize: 12, color: theme.textMid, fontWeight: 600 }}>{flight.from}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: theme.textLight, marginBottom: 4 }}>{flight.duration}</div>
            <div style={{ width: 80, height: 2, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', right: -4, top: -4, width: 10, height: 10, borderRadius: '50%', background: theme.accent }} />
            </div>
            <div style={{ fontSize: 11, color: flight.stops === 0 ? theme.success : theme.warn, marginTop: 4, fontWeight: 600 }}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: theme.text, letterSpacing: -1 }}>{flight.arr}</div>
            <div style={{ fontSize: 12, color: theme.textMid, fontWeight: 600 }}>{flight.to}</div>
          </div>
        </div>

        {/* CO2 */}
        <div style={{ minWidth: 120 }}>
          <CO2Badge value={flight.co2} />
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 26, color: theme.primary, letterSpacing: -1 }}>${flight.price}</div>
          <div style={{ fontSize: 11, color: theme.textLight, marginBottom: 8 }}>{flight.seats} seats left</div>
          <PricePredictionBadge prediction={flight.prediction} confidence={flight.confidence} />
        </div>
      </div>

      {selected && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(15,76,138,0.08)', display: 'flex', justifyContent: 'flex-end' }}>
          <Btn variant="accent" size="sm" icon="→">Select This Flight</Btn>
        </div>
      )}
    </Card>
  );
}
