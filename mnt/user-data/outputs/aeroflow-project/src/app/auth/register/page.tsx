'use client';
import { useState } from 'react';
import { theme } from '@/lib/theme';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div style={{ minHeight: '100vh', background: theme.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✈</div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 28, color: theme.text }}>Create Account</h1>
          <p style={{ color: theme.textLight, marginTop: 4 }}>Join AeroFlow today</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
            style={{ padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${theme.sky}`, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
            style={{ padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${theme.sky}`, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
            style={{ padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${theme.sky}`, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
          <button onClick={() => window.location.href = '/'}
            style={{ padding: '14px', background: theme.accent, color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, fontFamily: "'Plus Jakarta Sans',sans-serif", border: 'none', cursor: 'pointer' }}>
            Create Account
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: theme.textLight }}>
            Already have an account? <a href="/auth/login" style={{ color: theme.primary, fontWeight: 600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
