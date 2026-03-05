// ─── useFlightSearch ──────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { mockFlights, type Flight } from '@/data/mockData';

export function useFlightSearch() {
  const [results, setResults] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(
    (_from: string, _to: string, _date: string) => {
      setLoading(true);
      setSearched(false);
      // Simulate async search
      setTimeout(() => {
        setResults(mockFlights);
        setLoading(false);
        setSearched(true);
      }, 1200);
    },
    [],
  );

  return { results, loading, searched, search };
}

// ─── useNotifications ─────────────────────────────────────────────────────────
import { mockNotifications, type Notification } from '@/data/mockData';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, markRead, markAllRead, unreadCount };
}
