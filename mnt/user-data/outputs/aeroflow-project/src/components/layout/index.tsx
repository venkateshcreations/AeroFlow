'use client';

import { theme } from '@/lib/theme';
import { Avatar, Select } from '@/components/ui';
import type { UserRole } from '@/data/mockData';

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const navItems = {
  traveler: [
    { icon: '🏠', label: 'Dashboard',    page: 'traveler-home'  },
    { icon: '✈️', label: 'Search Flights', page: 'flight-search' },
    { icon: '🗺️', label: 'My Trips',      page: 'my-trips'      },
    { icon: '🤖', label: 'AI Planner',    page: 'ai-planner'    },
    { icon: '💳', label: 'Bookings',      page: 'bookings'      },
    { icon: '🔔', label: 'Notifications', page: 'notifications' },
    { icon: '⭐', label: 'Loyalty',       page: 'loyalty'       },
    { icon: '🌿', label: 'Sustainability',page: 'sustainability' },
    { icon: '👤', label: 'My Profile',    page: 'profile'       },
  ],
  agent: [
    { icon: '🏠', label: 'Dashboard',       page: 'agent-home'      },
    { icon: '🔍', label: 'Search Flights',  page: 'flight-search'   },
    { icon: '👥', label: 'Clients',         page: 'agent-clients'   },
    { icon: '📋', label: 'Manage Bookings', page: 'agent-bookings'  },
    { icon: '💰', label: 'Commission',      page: 'agent-commission'},
    { icon: '👤', label: 'My Profile',      page: 'profile'         },
  ],
  corporate: [
    { icon: '🏠', label: 'Dashboard',       page: 'corporate-home'      },
    { icon: '👤', label: 'Employee Travel', page: 'corporate-employees' },
    { icon: '✅', label: 'Approvals',       page: 'corporate-approvals' },
    { icon: '📊', label: 'Analytics',       page: 'corporate-analytics' },
    { icon: '📜', label: 'Policy',          page: 'corporate-policy'    },
    { icon: '💸', label: 'Expenses',        page: 'corporate-expenses'  },
    { icon: '🧑‍💼',label: 'My Profile',     page: 'profile'             },
  ],
  admin: [
    { icon: '🏠', label: 'Dashboard',   page: 'admin-home'     },
    { icon: '📊', label: 'Analytics',   page: 'admin-analytics'},
    { icon: '👥', label: 'Users',       page: 'admin-users'    },
    { icon: '✈️', label: 'Airlines',    page: 'admin-airlines' },
    { icon: '📋', label: 'Bookings',    page: 'admin-bookings' },
    { icon: '🛡️', label: 'Fraud Monitor',page: 'admin-fraud'  },
    { icon: '⚙️', label: 'Settings',   page: 'admin-settings' },
    { icon: '👤', label: 'My Profile', page: 'profile'         },
  ],
} as const;

const roleLabels: Record<UserRole, string> = {
  traveler:  'Traveler',
  agent:     'Agent',
  corporate: 'Corp Admin',
  admin:     'Platform Admin',
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
export function Sidebar({
  role, currentPage, onNavigate,
}: { role: UserRole; currentPage: string; onNavigate: (page: string) => void }) {
  const items = navItems[role] ?? navItems.traveler;

  return (
    <div style={{
      width: 240, height: '100vh', position: 'fixed', left: 0, top: 0,
      background: theme.dark, display: 'flex', flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(0,0,0,0.2)', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✈</div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: -0.5 }}>AeroFlow</div>
            <div style={{ fontSize: 10, color: theme.accent, fontWeight: 600, letterSpacing: 1 }}>{roleLabels[role]?.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {items.map((item) => {
          const active = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '11px 14px', borderRadius: 10, marginBottom: 2,
                background: active ? `linear-gradient(135deg, ${theme.accent}20, ${theme.primary}30)` : 'transparent',
                color: active ? theme.accent : 'rgba(255,255,255,0.65)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                border: active ? `1px solid ${theme.accent}30` : '1px solid transparent',
                transition: 'all 0.2s ease', textAlign: 'left', cursor: 'pointer',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => onNavigate('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 6px', borderRadius: 10, transition: 'background 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Avatar name="Arun Kumar" size={36} color={theme.accent} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Arun Kumar</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>View Profile →</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
export function TopBar({
  title, subtitle, role, onRoleChange, notifCount, onNavigate,
}: {
  title: string; subtitle?: string; role: UserRole;
  onRoleChange: (r: UserRole) => void; notifCount: number;
  onNavigate: (page: string) => void;
}) {
  return (
    <div style={{
      height: 70, background: '#fff', borderBottom: '1px solid rgba(15,76,138,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 2px 12px rgba(15,76,138,0.06)',
    }}>
      <div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 20, color: theme.text, letterSpacing: -0.5 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: theme.textLight }}>{subtitle}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Select
          options={[
            { value: 'traveler',  label: '👤 Traveler'  },
            { value: 'agent',     label: '🧑‍💼 Agent'   },
            { value: 'corporate', label: '🏢 Corporate' },
            { value: 'admin',     label: '⚙️ Admin'     },
          ]}
          value={role}
          onChange={(v) => onRoleChange(v as UserRole)}
          style={{ minWidth: 160 }}
        />

        {/* Notification Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onNavigate('notifications')}>
          <div
            style={{ width: 40, height: 40, borderRadius: 10, background: theme.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'background 0.2s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#d4eaf8')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = theme.sky)}
          >🔔</div>
          {notifCount > 0 && (
            <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: theme.danger, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {notifCount}
            </div>
          )}
        </div>

        {/* Avatar → Profile */}
        <div
          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
          onClick={() => onNavigate('profile')}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = '0.8')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = '1')}
        >
          <Avatar name="Arun Kumar" size={40} color={theme.primary} />
        </div>
      </div>
    </div>
  );
}
