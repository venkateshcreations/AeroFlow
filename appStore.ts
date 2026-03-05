import { create } from 'zustand';
import type { UserRole, Flight } from '@/data/mockData';

type Page =
  | 'traveler-home' | 'flight-search' | 'my-trips' | 'ai-planner'
  | 'bookings' | 'notifications' | 'loyalty' | 'sustainability' | 'checkout' | 'profile'
  | 'agent-home' | 'agent-clients' | 'agent-bookings' | 'agent-commission'
  | 'corporate-home' | 'corporate-employees' | 'corporate-approvals'
  | 'corporate-analytics' | 'corporate-policy' | 'corporate-expenses'
  | 'admin-home' | 'admin-analytics' | 'admin-users' | 'admin-airlines'
  | 'admin-bookings' | 'admin-fraud' | 'admin-settings';

interface AppState {
  role: UserRole;
  page: Page;
  selectedFlight: Flight | null;
  unreadNotifCount: number;

  setRole: (role: UserRole) => void;
  setPage: (page: Page) => void;
  setSelectedFlight: (flight: Flight | null) => void;
  decrementNotifCount: () => void;
  clearNotifCount: () => void;
}

const roleDefaults: Record<UserRole, Page> = {
  traveler:  'traveler-home',
  agent:     'agent-home',
  corporate: 'corporate-home',
  admin:     'admin-home',
};

export const useAppStore = create<AppState>((set) => ({
  role: 'traveler',
  page: 'traveler-home',
  selectedFlight: null,
  unreadNotifCount: 2,

  setRole: (role) => set({ role, page: roleDefaults[role] }),
  setPage: (page) => set({ page }),
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
  decrementNotifCount: () => set((s) => ({ unreadNotifCount: Math.max(0, s.unreadNotifCount - 1) })),
  clearNotifCount: () => set({ unreadNotifCount: 0 }),
}));
