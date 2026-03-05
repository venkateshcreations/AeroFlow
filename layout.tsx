import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'AeroFlow – Intelligent Flight Booking Platform',
  description:
    'Next-generation AI-powered travel booking ecosystem. Plan, book, manage and optimize your journeys through intelligent automation and real-time travel intelligence.',
  keywords: ['flight booking', 'travel', 'AI travel planner', 'OTA', 'aeroflow'],
  authors: [{ name: 'AeroFlow Team' }],
  openGraph: {
    title: 'AeroFlow – Intelligent Flight Booking',
    description: 'AI-powered travel booking for 2035',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="font-sans bg-[#F0F6FF] text-[#0A1628] antialiased">
        {children}
      </body>
    </html>
  );
}
