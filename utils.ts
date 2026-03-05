import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format currency */
export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
}

/** Format large numbers */
export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

/** Get greeting based on time */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/** CO2 level helper */
export function getCO2Level(co2: number, max = 500): 'eco' | 'moderate' | 'high' {
  const ratio = co2 / max;
  if (ratio < 0.4) return 'eco';
  if (ratio < 0.7) return 'moderate';
  return 'high';
}
