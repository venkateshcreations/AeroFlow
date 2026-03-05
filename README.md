# ✈️ AeroFlow – Next-Generation Flight Booking Platform

> AI-powered travel booking ecosystem for 2035. Plan, book, manage, and optimize journeys through intelligent automation, personalization, and real-time travel intelligence.

![AeroFlow Banner](https://img.shields.io/badge/AeroFlow-v1.0.0-0F4C8A?style=for-the-badge&logo=airplane)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss)

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/aeroflow.git
cd aeroflow

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# 4. Start the development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

---

## 🏗️ Project Structure

```
aeroflow/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Next.js 14 App Router
│   │   ├── layout.tsx               # Root layout (fonts, metadata)
│   │   ├── page.tsx                 # Entry point → renders AeroFlow
│   │   ├── globals.css              # Global styles + animations
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   ├── flights/
│   │   │   ├── search/
│   │   │   ├── results/
│   │   │   ├── details/
│   │   │   └── seat-selection/
│   │   ├── bookings/
│   │   │   ├── checkout/
│   │   │   ├── confirmation/
│   │   │   └── my-trips/
│   │   ├── travel/
│   │   │   ├── itinerary/
│   │   │   ├── notifications/
│   │   │   └── alerts/
│   │   ├── loyalty/
│   │   │   ├── rewards/
│   │   │   └── points/
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── users/
│   │   │   ├── bookings/
│   │   │   ├── integrations/
│   │   │   └── settings/
│   │   └── profile/
│   │
│   ├── components/
│   │   ├── AeroFlow.jsx             # 🌟 Main app component (all pages)
│   │   ├── ui/
│   │   │   └── index.tsx            # Badge, Btn, Card, Input, Select, Avatar, ProgressBar
│   │   ├── layout/
│   │   │   └── index.tsx            # Sidebar, TopBar
│   │   ├── flights/
│   │   │   └── FlightCard.tsx       # Flight result card
│   │   ├── booking/                 # Checkout, Seat Map, Stepper
│   │   └── analytics/              # Charts, Stats
│   │
│   ├── data/
│   │   └── mockData.ts              # All mock data + TypeScript types
│   │
│   ├── store/
│   │   └── appStore.ts              # Zustand global state
│   │
│   └── lib/
│       ├── theme.ts                 # Design tokens / color palette
│       └── utils.ts                 # Helper functions (cn, formatCurrency, etc.)
│
├── .env.example                     # Environment variable template
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## 🎨 Design System

### Color Palette
| Token       | Hex       | Usage                    |
|-------------|-----------|--------------------------|
| Primary     | `#0F4C8A` | Buttons, links, headings |
| Accent      | `#00C2A8` | CTAs, highlights, active |
| Dark        | `#0A1628` | Sidebar, hero sections   |
| Success     | `#00B894` | Eco, confirmed, positive |
| Warn        | `#FF6B35` | Delays, moderate alerts  |
| Danger      | `#E84393` | High risk, price up      |
| Gold        | `#FFB800` | Loyalty, premium tier    |

### Typography
- **Display / Headings**: [Outfit](https://fonts.google.com/specimen/Outfit) (300–900)
- **Body / UI**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (300–700)

---

## 🔐 Role-Based Access

| Role              | Default Page      | Key Features                           |
|-------------------|-------------------|----------------------------------------|
| 👤 Traveler       | traveler-home     | Search, book, trips, loyalty, AI plan  |
| 🧑‍💼 Agent        | agent-home        | Client management, commissions         |
| 🏢 Corporate      | corporate-home    | Employee travel, approvals, policy     |
| ⚙️ Platform Admin | admin-home        | Analytics, users, airlines, fraud      |

Switch roles using the **dropdown in the top-right** of the interface.

---

## 📱 Pages & Features

### Traveler
- **Dashboard** — AI suggestions, upcoming trips, live price alerts
- **Flight Search** — Filters, sort, CO₂ badges, price prediction
- **Booking Flow** — 5-step: Passenger → Seat Map → Add-ons → Payment → Confirmation
- **AI Planner** — Natural language trip planning (e.g. "4-day Singapore under $800")
- **My Trips** — Trip cards with status, hotel info, check-in
- **Notifications** — Filtered alerts, preferences panel, action buttons
- **Loyalty** — Points balance, tier progress, redeem rewards
- **Sustainability** — CO₂ tracker, offset options, eco score
- **Profile** — 6-tab profile: Overview, Personal Info, Travel Prefs, Security, Payments, Documents

### Agent
- Client list, booking management, commission tracker

### Corporate
- Employee travel requests with approve/reject, policy manager, expense dashboard

### Admin
- Revenue analytics, user management table, airline integrations, fraud monitor

---

## 🛠️ Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | Next.js 14 (App Router)             |
| Language         | TypeScript                          |
| Styling          | TailwindCSS + inline design tokens  |
| State            | Zustand                             |
| Data Fetching    | TanStack React Query                |
| Forms            | React Hook Form                     |
| Charts           | Recharts                            |
| Icons            | Lucide React                        |
| Animations       | Framer Motion                       |
| GDS Integration  | Amadeus, Sabre, Travelport (planned)|

---

## 🌐 GDS / External Integrations

Configure API keys in `.env.local`:

```env
AMADEUS_API_KEY=...
AMADEUS_API_SECRET=...
SABRE_API_KEY=...
TRAVELPORT_API_KEY=...
STRIPE_PUBLIC_KEY=...
```

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel (recommended)
npx vercel --prod
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/aeroflow)

---

## 🗺️ Roadmap

- [x] Phase 1 — Core booking engine, all role dashboards, flight search
- [x] Phase 2 — AI planner, personalization, analytics dashboard
- [x] Phase 3 — Notifications, profile management, sustainability engine
- [ ] Phase 4 — Real GDS API integration (Amadeus)
- [ ] Phase 5 — Voice booking, AR cabin preview, biometric auth
- [ ] Phase 6 — Mobile app (Flutter)

---

## 📄 License

MIT © 2035 AeroFlow Team

---

> Built with ❤️ as a next-generation OTA platform specification demo.
