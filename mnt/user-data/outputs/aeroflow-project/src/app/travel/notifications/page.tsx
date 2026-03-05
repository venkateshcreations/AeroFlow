'use client';
// travel/notifications — rendered inside the main AeroFlow SPA on the home page.
// This file exists for Next.js routing completeness.
import { useEffect } from 'react';
export default function Page() {
  useEffect(() => { window.location.href = '/'; }, []);
  return null;
}
