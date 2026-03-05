'use client';

import { useState } from 'react';
import { theme } from '@/lib/theme';

// ─── BADGE ────────────────────────────────────────────────────────────────────
type BadgeType = 'success' | 'warn' | 'info' | 'accent' | 'danger' | 'gold' | 'neutral';

const badgeColors: Record<BadgeType, { bg: string; color: string; border: string }> = {
  success: { bg: '#E8FAF5', color: '#00B894', border: '#00B894' },
  warn:    { bg: '#FFF4E8', color: '#FF6B35', border: '#FF6B35' },
  info:    { bg: '#E8F4FD', color: '#0F4C8A', border: '#0F4C8A' },
  accent:  { bg: '#E0FAF7', color: '#00C2A8', border: '#00C2A8' },
  danger:  { bg: '#FDE8F3', color: '#E84393', border: '#E84393' },
  gold:    { bg: '#FFF8E1', color: '#FFB800', border: '#FFB800' },
  neutral: { bg: '#F0F4F8', color: '#4A6080', border: '#4A6080' },
};

export function Badge({
  type = 'info', children, size = 'sm',
}: { type?: BadgeType; children: React.ReactNode; size?: 'sm' | 'md' }) {
  const c = badgeColors[type];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.color, border: `1px solid ${c.border}30`,
      borderRadius: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: size === 'sm' ? 11 : 13, fontWeight: 600,
      padding: size === 'sm' ? '2px 10px' : '4px 14px', letterSpacing: 0.3,
    }}>
      {children}
    </span>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'dark';
type BtnSize = 'sm' | 'md' | 'lg';

export function Btn({
  variant = 'primary', children, onClick, size = 'md', icon, disabled, style = {},
}: {
  variant?: BtnVariant; children?: React.ReactNode; onClick?: () => void;
  size?: BtnSize; icon?: React.ReactNode; disabled?: boolean; style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  const variants: Record<BtnVariant, { bg: string; hoverBg: string; color: string; border: string }> = {
    primary: { bg: theme.primary,  hoverBg: theme.primaryLight, color: '#fff', border: 'none' },
    accent:  { bg: theme.accent,   hoverBg: theme.accentLight,  color: '#fff', border: 'none' },
    outline: { bg: 'transparent',  hoverBg: theme.sky,          color: theme.primary, border: `1.5px solid ${theme.primary}` },
    ghost:   { bg: 'transparent',  hoverBg: theme.sky,          color: theme.primary, border: 'none' },
    danger:  { bg: theme.danger,   hoverBg: '#FF4070',          color: '#fff', border: 'none' },
    dark:    { bg: theme.dark,     hoverBg: theme.darkMid,      color: '#fff', border: 'none' },
  };

  const sizes: Record<BtnSize, { px: number; py: number; fs: number }> = {
    sm: { px: 14, py: 7,  fs: 13 },
    md: { px: 22, py: 11, fs: 14 },
    lg: { px: 32, py: 15, fs: 16 },
  };

  const v = variants[variant];
  const s = sizes[size];
  const bg = hovered ? v.hoverBg : v.bg;

  const boxShadow =
    variant === 'primary' ? '0 4px 14px rgba(15,76,138,0.3)' :
    variant === 'accent'  ? '0 4px 14px rgba(0,194,168,0.3)' : 'none';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
        background: bg, color: v.color, border: v.border,
        borderRadius: 10, fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600, fontSize: s.fs,
        padding: `${s.py}px ${s.px}px`,
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow,
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: s.fs + 2 }}>{icon}</span>}
      {children}
    </button>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({
  children, style = {}, className = '', onClick,
}: {
  children: React.ReactNode; style?: React.CSSProperties;
  className?: string; onClick?: () => void;
}) {
  return (
    <div
      className={`card-hover ${className}`}
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 16,
        boxShadow: '0 2px 24px rgba(15,76,138,0.08)',
        border: '1px solid rgba(15,76,138,0.06)',
        overflow: 'hidden', ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({
  icon, label, value, sub, color = theme.primary, trend,
}: {
  icon: string; label: string; value: string | number; sub?: string;
  color?: string; trend?: number;
}) {
  return (
    <Card style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textMid, fontWeight: 500, marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: theme.text, fontFamily: "'Outfit',sans-serif", letterSpacing: -1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: theme.textLight, marginTop: 4 }}>{sub}</div>}
          {trend !== undefined && (
            <div style={{ fontSize: 13, color: trend >= 0 ? theme.success : theme.danger, fontWeight: 600, marginTop: 6 }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
export function Input({
  label, placeholder, value, onChange, type = 'text', icon, style = {},
}: {
  label?: string; placeholder?: string; value?: string; onChange?: (v: string) => void;
  type?: string; icon?: string; style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: theme.textMid }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%', background: theme.light,
            border: `1.5px solid ${theme.sky}`, borderRadius: 10,
            padding: `11px ${icon ? '14px 11px 38px' : '14px'}`,
            fontSize: 14, color: theme.text, fontFamily: "'Plus Jakarta Sans',sans-serif",
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = theme.primary)}
          onBlur={(e) => (e.target.style.borderColor = theme.sky)}
        />
      </div>
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
export function Select({
  label, options, value, onChange, style = {},
}: {
  label?: string; options: { value: string; label: string }[];
  value?: string; onChange?: (v: string) => void; style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: theme.textMid }}>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          background: theme.light, border: `1.5px solid ${theme.sky}`, borderRadius: 10,
          padding: '11px 14px', fontSize: 14, color: theme.text,
          fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234A6080' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export function Avatar({
  name, size = 36, color = theme.primary,
}: { name: string; size?: number; color?: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}20`, color, fontSize: size * 0.36,
      fontWeight: 700, fontFamily: "'Outfit',sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `2px solid ${color}30`, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export function ProgressBar({
  value, max = 100, color = theme.accent, height = 6,
}: { value: number; max?: number; color?: string; height?: number }) {
  return (
    <div style={{ width: '100%', height, background: `${color}20`, borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min((value / max) * 100, 100)}%`, height: '100%',
        background: color, borderRadius: height / 2, transition: 'width 0.6s ease',
      }} />
    </div>
  );
}

// ─── CO2 BADGE ────────────────────────────────────────────────────────────────
export function CO2Badge({ value, max = 500 }: { value: number; max?: number }) {
  const ratio = value / max;
  const color = ratio < 0.4 ? theme.success : ratio < 0.7 ? theme.warn : theme.danger;
  const label = ratio < 0.4 ? 'Eco' : ratio < 0.7 ? 'Moderate' : 'High';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span style={{ color, fontWeight: 600 }}>🌿 {label} CO₂</span>
        <span style={{ color: theme.textMid }}>{value}kg</span>
      </div>
      <ProgressBar value={value} max={max} color={color} height={4} />
    </div>
  );
}

// ─── PRICE PREDICTION BADGE ───────────────────────────────────────────────────
export function PricePredictionBadge({
  prediction, confidence,
}: { prediction: 'up' | 'down' | 'stable'; confidence: number }) {
  const cfg = {
    up:     { color: theme.danger,  icon: '📈', text: 'Price Rising',   bg: '#FDE8F3' },
    down:   { color: theme.success, icon: '📉', text: 'Price Dropping', bg: '#E8FAF5' },
    stable: { color: theme.warn,    icon: '📊', text: 'Price Stable',   bg: '#FFF4E8' },
  };
  const c = cfg[prediction];
  return (
    <div style={{ background: c.bg, borderRadius: 8, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 14 }}>{c.icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.text}</div>
        <div style={{ fontSize: 10, color: theme.textLight }}>{confidence}% confidence</div>
      </div>
    </div>
  );
}
