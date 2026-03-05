import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const theme = {
  primary: "#0F4C8A",
  primaryLight: "#1A6FBF",
  accent: "#00C2A8",
  accentLight: "#00E5C8",
  sky: "#E8F4FD",
  dark: "#0A1628",
  darkMid: "#1C2E4A",
  mid: "#3D5A80",
  light: "#F0F6FF",
  white: "#FFFFFF",
  text: "#0A1628",
  textMid: "#4A6080",
  textLight: "#8A9BB0",
  warn: "#FF6B35",
  success: "#00B894",
  danger: "#E84393",
  gold: "#FFB800",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: ${theme.primary};
    --accent: ${theme.accent};
    --dark: ${theme.dark};
    --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${theme.light};
    color: ${theme.text};
    overflow-x: hidden;
  }

  h1,h2,h3,h4,h5 { font-family: 'Outfit', sans-serif; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${theme.light}; }
  ::-webkit-scrollbar-thumb { background: ${theme.mid}; border-radius: 3px; }

  .fade-in { animation: fadeIn 0.4s ease forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .slide-in { animation: slideIn 0.3s ease forwards; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

  .pulse { animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

  .float { animation: float 3s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

  .shimmer {
    background: linear-gradient(90deg, #f0f6ff 25%, #e0eaf5 50%, #f0f6ff 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .glass {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.6);
  }

  .card-hover {
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(15,76,138,0.15) !important;
  }

  button { cursor: pointer; border: none; outline: none; }
  input, select, textarea { outline: none; }

  .progress-bar {
    width: 100%;
    height: 3px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: ${theme.accent};
    border-radius: 2px;
    transition: width 0.5s ease;
  }
`;

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const mockFlights = [
  { id: "F001", from: "HYD", to: "DXB", fromCity: "Hyderabad", toCity: "Dubai", airline: "Emirates", logo: "✈", date: "2035-03-15", dep: "06:30", arr: "08:45", duration: "3h 15m", stops: 0, price: 420, co2: 180, rating: 4.8, seats: 12, class: "Economy", prediction: "up", confidence: 87 },
  { id: "F002", from: "HYD", to: "DXB", fromCity: "Hyderabad", toCity: "Dubai", airline: "IndiGo", logo: "🛫", date: "2035-03-15", dep: "10:15", arr: "12:40", duration: "3h 25m", stops: 0, price: 320, co2: 320, rating: 4.2, seats: 45, class: "Economy", prediction: "stable", confidence: 72 },
  { id: "F003", from: "HYD", to: "DXB", fromCity: "Hyderabad", toCity: "Dubai", airline: "Air Arabia", logo: "🛩", date: "2035-03-15", dep: "14:00", arr: "17:30", duration: "4h 30m", stops: 1, price: 285, co2: 420, rating: 3.9, seats: 8, class: "Economy", prediction: "down", confidence: 65 },
  { id: "F004", from: "HYD", to: "DXB", fromCity: "Hyderabad", toCity: "Dubai", airline: "Emirates", logo: "✈", date: "2035-03-15", dep: "20:00", arr: "22:15", duration: "3h 15m", stops: 0, price: 890, co2: 180, rating: 4.9, seats: 3, class: "Business", prediction: "up", confidence: 91 },
  { id: "F005", from: "BLR", to: "SIN", fromCity: "Bangalore", toCity: "Singapore", airline: "Singapore Air", logo: "🦁", date: "2035-03-20", dep: "23:55", arr: "06:30", duration: "5h 35m", stops: 0, price: 680, co2: 210, rating: 4.9, seats: 6, class: "Economy", prediction: "up", confidence: 89 },
  { id: "F006", from: "DEL", to: "LHR", fromCity: "New Delhi", toCity: "London", airline: "British Airways", logo: "🇬🇧", date: "2035-03-18", dep: "02:15", arr: "07:45", duration: "8h 30m", stops: 0, price: 1150, co2: 540, rating: 4.6, seats: 22, class: "Economy", prediction: "stable", confidence: 78 },
];

const mockTrips = [
  { id: "T001", destination: "Dubai", date: "Mar 15, 2035", status: "upcoming", flight: "F001", hotel: "Burj Al Arab", days: 4 },
  { id: "T002", destination: "Singapore", date: "Mar 20, 2035", status: "upcoming", flight: "F005", hotel: "Marina Bay Sands", days: 3 },
  { id: "T003", destination: "London", date: "Feb 10, 2035", status: "completed", flight: "F006", hotel: "The Savoy", days: 7 },
];

const mockNotifications = [
  { id: "N001", type: "delay", title: "Flight Delay Alert", msg: "EK202 delayed by 45 mins. New boarding: 21:15 at Gate B12", time: "5m ago", read: false },
  { id: "N002", type: "price", title: "Price Drop Detected", msg: "HYD→DXB dropped to ₹24,800. Book now before it changes!", time: "1h ago", read: false },
  { id: "N003", type: "checkin", title: "Check-in Open", msg: "Online check-in for EK202 is now available", time: "3h ago", read: true },
  { id: "N004", type: "points", title: "Points Earned", msg: "You earned 2,400 AeroPoints from your last booking!", time: "1d ago", read: true },
];

const analyticsData = [
  { month: "Oct", bookings: 1240, revenue: 84000, conversion: 3.2 },
  { month: "Nov", bookings: 1580, revenue: 102000, conversion: 3.8 },
  { month: "Dec", bookings: 2100, revenue: 148000, conversion: 4.1 },
  { month: "Jan", bookings: 1890, revenue: 127000, conversion: 3.9 },
  { month: "Feb", bookings: 2340, revenue: 164000, conversion: 4.4 },
  { month: "Mar", bookings: 2680, revenue: 192000, conversion: 4.8 },
];

const popularRoutes = [
  { route: "HYD → DXB", bookings: 4820, growth: 18 },
  { route: "BLR → SIN", bookings: 3940, growth: 24 },
  { route: "DEL → LHR", bookings: 3210, growth: 9 },
  { route: "MUM → JFK", bookings: 2870, growth: 31 },
  { route: "HYD → BLR", bookings: 2540, growth: 15 },
];

const employees = [
  { id: "E001", name: "Arjun Sharma", dept: "Engineering", trip: "Singapore", date: "Mar 20", status: "approved", budget: 1200 },
  { id: "E002", name: "Priya Nair", dept: "Sales", trip: "Dubai", date: "Mar 18", status: "pending", budget: 800 },
  { id: "E003", name: "Rahul Verma", dept: "Marketing", trip: "London", date: "Apr 5", status: "pending", budget: 1800 },
  { id: "E004", name: "Sneha Iyer", dept: "HR", trip: "Bangkok", date: "Mar 28", status: "approved", budget: 950 },
];

// ─── UTILITY COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ type, children, size = "sm" }) => {
  const colors = {
    success: { bg: "#E8FAF5", color: "#00B894", border: "#00B894" },
    warn: { bg: "#FFF4E8", color: "#FF6B35", border: "#FF6B35" },
    info: { bg: "#E8F4FD", color: "#0F4C8A", border: "#0F4C8A" },
    accent: { bg: "#E0FAF7", color: "#00C2A8", border: "#00C2A8" },
    danger: { bg: "#FDE8F3", color: "#E84393", border: "#E84393" },
    gold: { bg: "#FFF8E1", color: "#FFB800", border: "#FFB800" },
    neutral: { bg: "#F0F4F8", color: "#4A6080", border: "#4A6080" },
  };
  const c = colors[type] || colors.info;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}30`,
      borderRadius: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: size === "sm" ? 11 : 13, fontWeight: 600,
      padding: size === "sm" ? "2px 10px" : "4px 14px",
      letterSpacing: 0.3,
    }}>{children}</span>
  );
};

const Btn = ({ variant = "primary", children, onClick, size = "md", icon, disabled, style = {} }) => {
  const [hovered, setHovered] = useState(false);
  const variants = {
    primary: { bg: hovered ? theme.primaryLight : theme.primary, color: "#fff", border: "none" },
    accent: { bg: hovered ? theme.accentLight : theme.accent, color: "#fff", border: "none" },
    outline: { bg: hovered ? theme.sky : "transparent", color: theme.primary, border: `1.5px solid ${theme.primary}` },
    ghost: { bg: hovered ? theme.sky : "transparent", color: theme.primary, border: "none" },
    danger: { bg: hovered ? "#FF4070" : theme.danger, color: "#fff", border: "none" },
    dark: { bg: hovered ? theme.darkMid : theme.dark, color: "#fff", border: "none" },
  };
  const sizes = { sm: { px: 14, py: 7, fs: 13 }, md: { px: 22, py: 11, fs: 14 }, lg: { px: 32, py: 15, fs: 16 } };
  const v = variants[variant]; const s = sizes[size];
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
        background: v.bg, color: v.color, border: v.border,
        borderRadius: 10, fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600, fontSize: s.fs,
        padding: `${s.py}px ${s.px}px`,
        transition: "all 0.2s ease",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: variant === "primary" ? "0 4px 14px rgba(15,76,138,0.3)" : variant === "accent" ? "0 4px 14px rgba(0,194,168,0.3)" : "none",
        ...style,
      }}>
      {icon && <span style={{ fontSize: s.fs + 2 }}>{icon}</span>}
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, className = "", onClick }) => (
  <div className={`card-hover ${className}`} onClick={onClick}
    style={{
      background: "#fff", borderRadius: 16,
      boxShadow: "0 2px 24px rgba(15,76,138,0.08)",
      border: "1px solid rgba(15,76,138,0.06)",
      overflow: "hidden", ...style,
    }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color = theme.primary, trend }) => (
  <Card style={{ padding: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13, color: theme.textMid, fontWeight: 500, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: theme.text, fontFamily: "'Outfit',sans-serif", letterSpacing: -1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: theme.textLight, marginTop: 4 }}>{sub}</div>}
        {trend !== undefined && (
          <div style={{ fontSize: 13, color: trend >= 0 ? theme.success : theme.danger, fontWeight: 600, marginTop: 6 }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
    </div>
  </Card>
);

const Input = ({ label, placeholder, value, onChange, type = "text", icon, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: theme.textMid }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)}
        style={{
          width: "100%", background: theme.light, border: `1.5px solid ${theme.sky}`,
          borderRadius: 10, padding: `11px ${icon ? "14px 11px 38px" : "14px"}`,
          fontSize: 14, color: theme.text, fontFamily: "'Plus Jakarta Sans',sans-serif",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = theme.primary}
        onBlur={e => e.target.style.borderColor = theme.sky}
      />
    </div>
  </div>
);

const Select = ({ label, options, value, onChange, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: theme.textMid }}>{label}</label>}
    <select value={value} onChange={e => onChange?.(e.target.value)}
      style={{
        background: theme.light, border: `1.5px solid ${theme.sky}`, borderRadius: 10,
        padding: "11px 14px", fontSize: 14, color: theme.text,
        fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234A6080' fill='none' stroke-width='1.5'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Avatar = ({ name, size = 36, color = theme.primary }) => {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}20`, color: color, fontSize: size * 0.36,
      fontWeight: 700, fontFamily: "'Outfit',sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: `2px solid ${color}30`, flexShrink: 0,
    }}>{initials}</div>
  );
};

const ProgressBar = ({ value, max = 100, color = theme.accent, height = 6 }) => (
  <div style={{ width: "100%", height, background: `${color}20`, borderRadius: height / 2, overflow: "hidden" }}>
    <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: height / 2, transition: "width 0.6s ease" }} />
  </div>
);

const CO2Badge = ({ value, max = 500 }) => {
  const ratio = value / max;
  const color = ratio < 0.4 ? theme.success : ratio < 0.7 ? theme.warn : theme.danger;
  const label = ratio < 0.4 ? "Eco" : ratio < 0.7 ? "Moderate" : "High";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color, fontWeight: 600 }}>🌿 {label} CO₂</span>
        <span style={{ color: theme.textMid }}>{value}kg</span>
      </div>
      <ProgressBar value={value} max={max} color={color} height={4} />
    </div>
  );
};

const PricePredictionBadge = ({ prediction, confidence }) => {
  const cfg = {
    up: { color: theme.danger, icon: "📈", text: "Price Rising", bg: "#FDE8F3" },
    down: { color: theme.success, icon: "📉", text: "Price Dropping", bg: "#E8FAF5" },
    stable: { color: theme.warn, icon: "📊", text: "Price Stable", bg: "#FFF4E8" },
  };
  const c = cfg[prediction] || cfg.stable;
  return (
    <div style={{ background: c.bg, borderRadius: 8, padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 14 }}>{c.icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.text}</div>
        <div style={{ fontSize: 10, color: theme.textLight }}>{confidence}% confidence</div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────
const navItems = {
  traveler: [
    { icon: "🏠", label: "Dashboard", page: "traveler-home" },
    { icon: "✈️", label: "Search Flights", page: "flight-search" },
    { icon: "🗺️", label: "My Trips", page: "my-trips" },
    { icon: "🤖", label: "AI Planner", page: "ai-planner" },
    { icon: "💳", label: "Bookings", page: "bookings" },
    { icon: "🔔", label: "Notifications", page: "notifications" },
    { icon: "⭐", label: "Loyalty", page: "loyalty" },
    { icon: "🌿", label: "Sustainability", page: "sustainability" },
    { icon: "👤", label: "My Profile", page: "profile" },
  ],
  agent: [
    { icon: "🏠", label: "Dashboard", page: "agent-home" },
    { icon: "🔍", label: "Search Flights", page: "flight-search" },
    { icon: "👥", label: "Clients", page: "agent-clients" },
    { icon: "📋", label: "Manage Bookings", page: "agent-bookings" },
    { icon: "💰", label: "Commission", page: "agent-commission" },
    { icon: "👤", label: "My Profile", page: "profile" },
  ],
  corporate: [
    { icon: "🏠", label: "Dashboard", page: "corporate-home" },
    { icon: "👤", label: "Employee Travel", page: "corporate-employees" },
    { icon: "✅", label: "Approvals", page: "corporate-approvals" },
    { icon: "📊", label: "Analytics", page: "corporate-analytics" },
    { icon: "📜", label: "Policy", page: "corporate-policy" },
    { icon: "💸", label: "Expenses", page: "corporate-expenses" },
    { icon: "🧑‍💼", label: "My Profile", page: "profile" },
  ],
  admin: [
    { icon: "🏠", label: "Dashboard", page: "admin-home" },
    { icon: "📊", label: "Analytics", page: "admin-analytics" },
    { icon: "👥", label: "Users", page: "admin-users" },
    { icon: "✈️", label: "Airlines", page: "admin-airlines" },
    { icon: "📋", label: "Bookings", page: "admin-bookings" },
    { icon: "🛡️", label: "Fraud Monitor", page: "admin-fraud" },
    { icon: "⚙️", label: "Settings", page: "admin-settings" },
    { icon: "👤", label: "My Profile", page: "profile" },
  ],
};

const Sidebar = ({ role, currentPage, onNavigate }) => {
  const items = navItems[role] || navItems.traveler;
  const roleLabels = { traveler: "Traveler", agent: "Agent", corporate: "Corp Admin", admin: "Platform Admin" };
  return (
    <div style={{
      width: 240, height: "100vh", position: "fixed", left: 0, top: 0,
      background: theme.dark, display: "flex", flexDirection: "column",
      boxShadow: "4px 0 24px rgba(0,0,0,0.2)", zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>AeroFlow</div>
            <div style={{ fontSize: 10, color: theme.accent, fontWeight: 600, letterSpacing: 1 }}>{roleLabels[role]?.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {items.map(item => {
          const active = currentPage === item.page;
          return (
            <button key={item.page} onClick={() => onNavigate(item.page)}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "11px 14px", borderRadius: 10, marginBottom: 2,
                background: active ? `linear-gradient(135deg, ${theme.accent}20, ${theme.primary}30)` : "transparent",
                color: active ? theme.accent : "rgba(255,255,255,0.65)",
                fontSize: 14, fontWeight: active ? 600 : 400,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                border: active ? `1px solid ${theme.accent}30` : "1px solid transparent",
                transition: "all 0.2s ease", textAlign: "left", cursor: "pointer",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={() => onNavigate("profile")} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: "8px 6px", borderRadius: 10, transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <Avatar name="Arun Kumar" size={36} color={theme.accent} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Arun Kumar</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>View Profile →</div>
          </div>
        </button>
      </div>
    </div>
  );
};

// ─── TOPBAR ────────────────────────────────────────────────────────────────────
const TopBar = ({ title, subtitle, onRoleChange, role, notifCount = 2, onNavigate }) => (
  <div style={{
    height: 70, background: "#fff", borderBottom: "1px solid rgba(15,76,138,0.08)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", position: "sticky", top: 0, zIndex: 50,
    boxShadow: "0 2px 12px rgba(15,76,138,0.06)",
  }}>
    <div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 20, color: theme.text, letterSpacing: -0.5 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: theme.textLight }}>{subtitle}</div>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Select options={[
        { value: "traveler", label: "👤 Traveler" },
        { value: "agent", label: "🧑‍💼 Agent" },
        { value: "corporate", label: "🏢 Corporate" },
        { value: "admin", label: "⚙️ Admin" },
      ]} value={role} onChange={onRoleChange} style={{ minWidth: 160 }} />
      {/* Notification Bell */}
      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => onNavigate?.("notifications")}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.sky, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#d4eaf8"}
          onMouseLeave={e => e.currentTarget.style.background = theme.sky}>🔔</div>
        {notifCount > 0 && <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: theme.danger, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifCount}</div>}
      </div>
      {/* Avatar → Profile */}
      <div style={{ cursor: "pointer", borderRadius: "50%", transition: "opacity 0.2s" }}
        onClick={() => onNavigate?.("profile")}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        <Avatar name="Arun Kumar" size={40} color={theme.primary} />
      </div>
    </div>
  </div>
);

// ─── FLIGHT CARD ───────────────────────────────────────────────────────────────
const FlightCard = ({ flight, onSelect, selected }) => (
  <Card style={{ padding: 20, border: selected ? `2px solid ${theme.accent}` : "1px solid rgba(15,76,138,0.06)", cursor: "pointer" }} onClick={() => onSelect?.(flight)}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      {/* Airline */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 160 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${theme.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{flight.logo}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{flight.airline}</div>
          <div style={{ fontSize: 12, color: theme.textLight }}>✦ {flight.rating} · {flight.class}</div>
        </div>
      </div>

      {/* Times */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: theme.text, letterSpacing: -1 }}>{flight.dep}</div>
          <div style={{ fontSize: 12, color: theme.textMid, fontWeight: 600 }}>{flight.from}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: theme.textLight, marginBottom: 4 }}>{flight.duration}</div>
          <div style={{ width: 80, height: 2, background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: 1, position: "relative" }}>
            <div style={{ position: "absolute", right: -4, top: -4, width: 10, height: 10, borderRadius: "50%", background: theme.accent }} />
          </div>
          <div style={{ fontSize: 11, color: flight.stops === 0 ? theme.success : theme.warn, marginTop: 4, fontWeight: 600 }}>
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: theme.text, letterSpacing: -1 }}>{flight.arr}</div>
          <div style={{ fontSize: 12, color: theme.textMid, fontWeight: 600 }}>{flight.to}</div>
        </div>
      </div>

      {/* CO2 */}
      <div style={{ minWidth: 120 }}>
        <CO2Badge value={flight.co2} />
      </div>

      {/* Price */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 26, color: theme.primary, letterSpacing: -1 }}>${flight.price}</div>
        <div style={{ fontSize: 11, color: theme.textLight, marginBottom: 8 }}>{flight.seats} seats left</div>
        <PricePredictionBadge prediction={flight.prediction} confidence={flight.confidence} />
      </div>
    </div>
    {selected && <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(15,76,138,0.08)", display: "flex", justifyContent: "flex-end" }}>
      <Btn variant="accent" size="sm" icon="→">Select This Flight</Btn>
    </div>}
  </Card>
);

// ─── PAGES ─────────────────────────────────────────────────────────────────────

// TRAVELER HOME
const TravelerHome = ({ onNavigate }) => {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
  });

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.darkMid} 50%, ${theme.primary} 100%)`, borderRadius: 20, padding: "40px 48px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `${theme.accent}10` }} />
        <div style={{ position: "absolute", bottom: -20, right: 80, width: 120, height: 120, borderRadius: "50%", background: `${theme.primaryLight}20` }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>{greeting}, Arun 👋</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: -1, marginBottom: 8, lineHeight: 1.2 }}>Where are you flying<br />to next?</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>AI has 3 personalized suggestions waiting for you</div>
          <Btn variant="accent" size="lg" icon="✈" onClick={() => onNavigate("flight-search")}>Search Flights</Btn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="✈️" label="Total Trips" value="24" sub="3 upcoming" color={theme.primary} trend={12} />
        <StatCard icon="⭐" label="Loyalty Points" value="12,450" sub="Gold Member" color={theme.gold} trend={8} />
        <StatCard icon="💰" label="Total Savings" value="$2,840" sub="From deals" color={theme.success} />
        <StatCard icon="🌿" label="CO₂ Offset" value="840kg" sub="Eco friendly" color={theme.success} />
      </div>

      {/* AI Suggestions + Upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* AI Suggestions */}
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16 }}>AI Suggestions</div>
            <Badge type="accent">Personalized</Badge>
          </div>
          {[
            { dest: "Dubai 🇦🇪", price: "$420", reason: "Based on travel history", date: "Mar 15" },
            { dest: "Singapore 🇸🇬", price: "$680", reason: "Price drop detected", date: "Mar 20" },
            { dest: "Bangkok 🇹🇭", price: "$340", reason: "Trending destination", date: "Apr 5" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{s.dest}</div>
                <div style={{ fontSize: 12, color: theme.textLight }}>{s.reason} · {s.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: theme.primary }}>{s.price}</div>
                <Btn variant="ghost" size="sm" onClick={() => onNavigate("flight-search")}>Book</Btn>
              </div>
            </div>
          ))}
        </Card>

        {/* Upcoming Trips */}
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>✈️ Upcoming Trips</div>
          {mockTrips.filter(t => t.status === "upcoming").map((trip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < 1 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏙</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{trip.destination}</div>
                <div style={{ fontSize: 12, color: theme.textLight }}>{trip.date} · {trip.days} days · {trip.hotel}</div>
              </div>
              <Badge type="info">{trip.days}d</Badge>
            </div>
          ))}
          <Btn variant="outline" size="sm" style={{ width: "100%", marginTop: 16 }} onClick={() => onNavigate("my-trips")}>View All Trips</Btn>
        </Card>
      </div>

      {/* Price Alerts */}
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🔔 Live Price Alerts</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { route: "HYD → DXB", price: "$420", change: -15, trend: "down" },
            { route: "BLR → SIN", price: "$680", change: +8, trend: "up" },
            { route: "DEL → LHR", price: "$1,150", change: 0, trend: "stable" },
          ].map((a, i) => (
            <div key={i} style={{ background: theme.sky, borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{a.route}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: theme.primary }}>{a.price}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: a.change < 0 ? theme.success : a.change > 0 ? theme.danger : theme.warn }}>
                  {a.change < 0 ? "↓" : a.change > 0 ? "↑" : "—"} {Math.abs(a.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// FLIGHT SEARCH
const FlightSearch = ({ onNavigate, onFlightSelect }) => {
  const [from, setFrom] = useState("Hyderabad (HYD)");
  const [to, setTo] = useState("Dubai (DXB)");
  const [date, setDate] = useState("2035-03-15");
  const [passengers, setPassengers] = useState("1");
  const [classType, setClassType] = useState("economy");
  const [tripType, setTripType] = useState("roundtrip");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const [maxPrice, setMaxPrice] = useState(1500);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 1200);
  };

  const handleSelect = (flight) => {
    setSelectedFlight(flight.id === selectedFlight ? null : flight.id);
    onFlightSelect?.(flight);
  };

  const displayFlights = [...mockFlights].sort((a, b) => sortBy === "price" ? a.price - b.price : sortBy === "duration" ? a.duration.localeCompare(b.duration) : b.rating - a.rating).filter(f => f.price <= maxPrice);

  return (
    <div className="fade-in">
      {/* Search Form */}
      <Card style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>✈️ Search Flights</div>

        {/* Trip Type */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["roundtrip", "oneway", "multicity"].map(t => (
            <button key={t} onClick={() => setTripType(t)}
              style={{ padding: "8px 18px", borderRadius: 20, border: `1.5px solid ${tripType === t ? theme.primary : "rgba(15,76,138,0.15)"}`, background: tripType === t ? `${theme.primary}10` : "transparent", color: tripType === t ? theme.primary : theme.textMid, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              {t === "roundtrip" ? "↩ Round Trip" : t === "oneway" ? "→ One Way" : "⇶ Multi-City"}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px 160px 160px", gap: 12, alignItems: "end" }}>
          <Input label="From" placeholder="Origin city" value={from} onChange={setFrom} icon="🛫" />
          <Input label="To" placeholder="Destination" value={to} onChange={setTo} icon="🛬" />
          <Input label="Date" type="date" value={date} onChange={setDate} />
          <Select label="Passengers" options={["1", "2", "3", "4", "5", "6"].map(n => ({ value: n, label: `${n} Passenger${n > 1 ? "s" : ""}` }))} value={passengers} onChange={setPassengers} />
          <Select label="Class" options={[{ value: "economy", label: "Economy" }, { value: "business", label: "Business" }, { value: "first", label: "First" }]} value={classType} onChange={setClassType} />
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <Btn variant="primary" size="lg" icon="🔍" onClick={handleSearch}>Search Flights</Btn>
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }} className="float">✈️</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: theme.primary }}>Searching best flights...</div>
          <div style={{ color: theme.textLight, marginTop: 8 }}>Comparing 200+ airlines worldwide</div>
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
          {/* Filters */}
          <Card style={{ padding: 20, height: "fit-content", position: "sticky", top: 90 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>🎚 Filters</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMid, marginBottom: 12 }}>Sort By</div>
              {["price", "duration", "rating"].map(s => (
                <button key={s} onClick={() => setSortBy(s)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, marginBottom: 4, background: sortBy === s ? `${theme.primary}10` : "transparent", color: sortBy === s ? theme.primary : theme.textMid, fontSize: 13, fontWeight: sortBy === s ? 600 : 400, border: "none", cursor: "pointer" }}>
                  {s === "price" ? "💰 Lowest Price" : s === "duration" ? "⏱ Shortest Duration" : "⭐ Best Rating"}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMid, marginBottom: 8 }}>Max Price: ${maxPrice}</div>
              <input type="range" min={200} max={2000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: theme.primary }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMid, marginBottom: 12 }}>Stops</div>
              {["Non-stop", "1 Stop", "2+ Stops"].map((s, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer", fontSize: 13, color: theme.textMid }}>
                  <input type="checkbox" defaultChecked={i < 2} style={{ accentColor: theme.primary }} /> {s}
                </label>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMid, marginBottom: 12 }}>Airlines</div>
              {["Emirates", "IndiGo", "Air Arabia", "Singapore Air"].map(a => (
                <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer", fontSize: 13, color: theme.textMid }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: theme.primary }} /> {a}
                </label>
              ))}
            </div>
          </Card>

          {/* Flight List */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: theme.textMid }}><span style={{ fontWeight: 700, color: theme.text }}>{displayFlights.length} flights</span> found for {from} → {to}</div>
              <Badge type="info">🤖 AI-powered results</Badge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {displayFlights.map(f => (
                <FlightCard key={f.id} flight={f} onSelect={handleSelect} selected={selectedFlight === f.id} />
              ))}
            </div>
            {selectedFlight && (
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <Btn variant="accent" size="lg" icon="→" onClick={() => onNavigate("checkout")}>Continue to Booking</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// CHECKOUT PAGE
const Checkout = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const steps = ["Passenger Details", "Seat Selection", "Add Services", "Payment", "Confirmation"];

  const SeatMap = () => {
    const [selected, setSelected] = useState(["12A"]);
    const rows = [1, 2, 3, 4, 5, 6, 7, 8];
    const cols = ["A", "B", "C", "", "D", "E", "F"];
    const occupied = ["1A", "1B", "2C", "3A", "4B", "5C", "6A", "7B", "8F", "2A", "3F"];

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          {[{ color: theme.success, label: "Available" }, { color: theme.primary, label: "Selected" }, { color: "#ccc", label: "Occupied" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.textMid }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color }} /> {l.label}
            </div>
          ))}
        </div>
        <div style={{ background: `${theme.dark}10`, borderRadius: 8, padding: 8, marginBottom: 8, width: "100%", textAlign: "center", fontSize: 12, color: theme.textMid }}>🛫 Front of Aircraft</div>
        {rows.map(row => (
          <div key={row} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: theme.textLight, width: 20, textAlign: "right" }}>{row}</span>
            {cols.map((col, ci) => col === "" ? <div key={ci} style={{ width: 10 }} /> : (
              <button key={col} onClick={() => { const id = `${row}${col}`; if (!occupied.includes(id)) setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]); }}
                style={{ width: 32, height: 30, borderRadius: 6, fontSize: 10, fontWeight: 600, border: "none", cursor: occupied.includes(`${row}${col}`) ? "not-allowed" : "pointer", background: occupied.includes(`${row}${col}`) ? "#ddd" : selected.includes(`${row}${col}`) ? theme.primary : `${theme.success}30`, color: selected.includes(`${row}${col}`) ? "#fff" : theme.success, transition: "all 0.15s" }}>
                {col}
              </button>
            ))}
          </div>
        ))}
        <div style={{ fontSize: 13, color: theme.textMid, marginTop: 8 }}>Selected: {selected.join(", ")}</div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      {/* Stepper */}
      <Card style={{ padding: "20px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "initial" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: i + 1 <= step ? theme.primary : theme.sky, color: i + 1 <= step ? "#fff" : theme.textLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i + 1 < step ? 18 : 13, fontWeight: 700, transition: "all 0.3s", border: i + 1 === step ? `3px solid ${theme.accent}` : "none" }}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: 11, color: i + 1 <= step ? theme.primary : theme.textLight, fontWeight: i + 1 === step ? 700 : 400, marginTop: 6, whiteSpace: "nowrap" }}>{s}</div>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i + 1 < step ? `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` : theme.sky, margin: "0 8px", marginBottom: 20, transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <div>
          {step === 1 && (
            <Card style={{ padding: 28 }} className="fade-in">
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>👤 Passenger Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <Input label="First Name" placeholder="Arun" />
                <Input label="Last Name" placeholder="Kumar" />
                <Input label="Email" placeholder="arun@email.com" type="email" />
                <Input label="Phone" placeholder="+91 98765 43210" />
                <Input label="Passport Number" placeholder="P1234567" />
                <Select label="Nationality" options={[{ value: "IN", label: "🇮🇳 India" }, { value: "AE", label: "🇦🇪 UAE" }]} value="IN" />
              </div>
              <Btn variant="primary" onClick={() => setStep(2)} icon="→">Continue to Seat Selection</Btn>
            </Card>
          )}
          {step === 2 && (
            <Card style={{ padding: 28 }} className="fade-in">
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>💺 Select Your Seat</div>
              <SeatMap />
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <Btn variant="outline" onClick={() => setStep(1)} icon="←">Back</Btn>
                <Btn variant="primary" onClick={() => setStep(3)} icon="→">Continue to Add-ons</Btn>
              </div>
            </Card>
          )}
          {step === 3 && (
            <Card style={{ padding: 28 }} className="fade-in">
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>🧳 Add Services</div>
              {[
                { icon: "🧳", title: "Extra Baggage", desc: "Add 20kg additional baggage", price: 45, options: ["10kg +$25", "20kg +$45", "30kg +$65"] },
                { icon: "🍽", title: "Meal Preference", desc: "Choose your in-flight meal", price: 12, options: ["Veg", "Non-Veg", "Vegan", "Kosher"] },
                { icon: "🛡", title: "Travel Insurance", desc: "Full coverage for your trip", price: 28, options: ["Basic $15", "Standard $28", "Premium $55"] },
                { icon: "🚕", title: "Airport Transfer", desc: "Taxi to/from airport", price: 35, options: ["Economy Car", "SUV", "Luxury"] },
              ].map((svc, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: i < 3 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ fontSize: 24 }}>{svc.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{svc.title}</div>
                      <div style={{ fontSize: 12, color: theme.textLight }}>{svc.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: theme.primary }}>+${svc.price}</span>
                    <Btn variant="outline" size="sm">Add</Btn>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <Btn variant="outline" onClick={() => setStep(2)} icon="←">Back</Btn>
                <Btn variant="primary" onClick={() => setStep(4)} icon="→">Continue to Payment</Btn>
              </div>
            </Card>
          )}
          {step === 4 && (
            <Card style={{ padding: 28 }} className="fade-in">
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>💳 Payment</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {[{ id: "card", icon: "💳", label: "Card" }, { id: "upi", icon: "📱", label: "UPI" }, { id: "apple", icon: "🍎", label: "Apple Pay" }, { id: "google", icon: "🔵", label: "Google Pay" }].map(m => (
                  <button key={m.id} style={{ flex: 1, padding: "14px 8px", borderRadius: 10, border: `2px solid ${m.id === "card" ? theme.primary : "rgba(15,76,138,0.12)"}`, background: m.id === "card" ? `${theme.primary}08` : "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: m.id === "card" ? theme.primary : theme.textMid }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div> {m.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                <Input label="Card Number" placeholder="1234 5678 9012 3456" icon="💳" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="Expiry" placeholder="MM/YY" />
                  <Input label="CVV" placeholder="•••" />
                </div>
                <Input label="Name on Card" placeholder="ARUN KUMAR" />
              </div>
              <div style={{ background: `${theme.success}10`, borderRadius: 12, padding: 14, marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>🔒</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.success }}>Secure Payment</div>
                  <div style={{ fontSize: 12, color: theme.textLight }}>256-bit SSL encryption · PCI-DSS compliant</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="outline" onClick={() => setStep(3)} icon="←">Back</Btn>
                <Btn variant="accent" size="lg" style={{ flex: 1 }} onClick={() => setStep(5)} icon="✓">Pay $420 Now</Btn>
              </div>
            </Card>
          )}
          {step === 5 && (
            <Card style={{ padding: 48, textAlign: "center" }} className="fade-in">
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${theme.success}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 24px" }}>✅</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 28, color: theme.text, marginBottom: 8 }}>Booking Confirmed!</div>
              <div style={{ fontSize: 15, color: theme.textLight, marginBottom: 24 }}>Your flight EK202 is booked. Booking ID: <strong>AEF-2035-78421</strong></div>
              <div style={{ background: theme.sky, borderRadius: 12, padding: 20, marginBottom: 28, textAlign: "left" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[["Flight", "EK202 – Emirates"], ["From", "Hyderabad (HYD)"], ["To", "Dubai (DXB)"], ["Date", "Mar 15, 2035"], ["Seat", "12A"], ["Class", "Economy"]].map(([k, v], i) => (
                    <div key={i}>
                      <div style={{ fontSize: 12, color: theme.textLight }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Btn variant="primary" icon="📄">Download Ticket</Btn>
                <Btn variant="outline" onClick={() => onNavigate("traveler-home")}>Go to Dashboard</Btn>
              </div>
            </Card>
          )}
        </div>

        {/* Summary */}
        {step < 5 && (
          <Card style={{ padding: 24, height: "fit-content", position: "sticky", top: 90 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>📋 Booking Summary</div>
            <div style={{ background: theme.sky, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>HYD → DXB</span>
                <Badge type="success">Non-stop</Badge>
              </div>
              <div style={{ fontSize: 13, color: theme.textMid }}>Emirates · EK202 · Mar 15 2035</div>
              <div style={{ fontSize: 13, color: theme.textMid }}>06:30 → 08:45 · 3h 15m</div>
            </div>
            {[["Base Fare", "$380"], ["Taxes & Fees", "$40"], ["Seat Fee", "$12"], ["Insurance", "$28"]].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(15,76,138,0.06)", fontSize: 14, color: theme.textMid }}>
                <span>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, marginTop: 4 }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: theme.primary }}>$460</span>
            </div>
            <CO2Badge value={180} />
          </Card>
        )}
      </div>
    </div>
  );
};

// MY TRIPS
const MyTrips = () => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
      {mockTrips.map((trip, i) => (
        <Card key={i} style={{ overflow: "hidden" }}>
          <div style={{ height: 140, background: `linear-gradient(135deg, ${i === 0 ? "#0F4C8A, #00C2A8" : i === 1 ? "#1a1a2e, #16213e" : "#2d3561, #c94b4b"})`, display: "flex", alignItems: "flex-end", padding: "16px 20px", position: "relative" }}>
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <Badge type={trip.status === "upcoming" ? "accent" : "neutral"}>{trip.status}</Badge>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff" }}>{trip.destination}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{trip.date} · {trip.days} days</div>
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <Badge type="info">✈ Flight Booked</Badge>
              <Badge type="neutral">🏨 {trip.hotel}</Badge>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="outline" size="sm" style={{ flex: 1 }}>View Details</Btn>
              {trip.status === "upcoming" && <Btn variant="ghost" size="sm">Check-in</Btn>}
            </div>
          </div>
        </Card>
      ))}
      {/* Add Trip Card */}
      <div style={{ border: `2px dashed ${theme.primary}30`, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, cursor: "pointer", gap: 12 }}>
        <div style={{ fontSize: 36 }}>+</div>
        <div style={{ fontWeight: 600, color: theme.textMid }}>Plan New Trip</div>
        <div style={{ fontSize: 12, color: theme.textLight, textAlign: "center" }}>Let AI help you plan your next adventure</div>
      </div>
    </div>
  </div>
);

// AI PLANNER
const AIPlanner = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlan = () => {
    if (!query) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResponse({
        destination: "Singapore",
        days: 4, budget: 800, used: 742,
        flights: [{ airline: "Singapore Air", dep: "23:55", arr: "06:30", price: 680 }],
        hotels: [{ name: "Marina Bay Sands", stars: 5, price: 280, nights: 4 }],
        activities: ["Gardens by the Bay", "Sentosa Island", "Merlion Park", "Hawker Centre food tour"],
        breakdown: [{ item: "Flights", cost: 680 }, { item: "Hotel", cost: 280 }, { item: "Activities", cost: 120 }, { item: "Food", cost: 80 }, { item: "Transport", cost: 42 }],
      });
    }, 2000);
  };

  return (
    <div className="fade-in">
      <Card style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 28, color: theme.text, marginBottom: 8 }}>AI Travel Planner</div>
          <div style={{ color: theme.textLight, fontSize: 15 }}>Describe your dream trip and let AI plan everything</div>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <input placeholder='e.g. "Plan a 4-day trip to Singapore under $800"' value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handlePlan()}
              style={{ flex: 1, background: theme.sky, border: `2px solid ${theme.primary}20`, borderRadius: 12, padding: "14px 18px", fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", color: theme.text }}
            />
            <Btn variant="primary" size="lg" icon="✨" onClick={handlePlan} disabled={loading}>Plan</Btn>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {["4-day Singapore under $800", "Weekend Bangkok trip", "Business trip to Dubai"].map(s => (
              <button key={s} onClick={() => setQuery(s)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${theme.primary}30`, background: "transparent", fontSize: 12, color: theme.primary, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        </div>
      </Card>

      {loading && (
        <Card style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }} className="pulse">🤖</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700 }}>Planning your trip...</div>
          {["Searching best flights", "Comparing hotels", "Finding activities", "Optimizing budget"].map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: theme.textLight, marginTop: 8, opacity: 1 - i * 0.2 }}>✓ {s}</div>
          ))}
        </Card>
      )}

      {response && !loading && (
        <div className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 16 }}>✈️ Recommended Flight</div>
              {response.flights.map((f, i) => (
                <div key={i} style={{ background: theme.sky, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{f.airline}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{f.dep} → {f.arr}</span>
                    <span style={{ fontWeight: 700, color: theme.primary }}>${f.price}</span>
                  </div>
                </div>
              ))}
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 16 }}>🏨 Recommended Hotel</div>
              {response.hotels.map((h, i) => (
                <div key={i} style={{ background: theme.sky, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{h.name}</div>
                  <div style={{ fontSize: 13, color: theme.textLight }}>{"⭐".repeat(h.stars)} · {h.nights} nights · ${h.price}/night</div>
                </div>
              ))}
            </Card>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 16 }}>🎭 Activities</div>
              {response.activities.map((a, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: i < response.activities.length - 1 ? "1px solid rgba(15,76,138,0.06)" : "none", fontSize: 14, display: "flex", gap: 8 }}>
                  <span style={{ color: theme.accent }}>✓</span> {a}
                </div>
              ))}
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 16 }}>💰 Budget Breakdown</div>
              {response.breakdown.map((b, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span>{b.item}</span><span style={{ fontWeight: 600 }}>${b.cost}</span>
                  </div>
                  <ProgressBar value={b.cost} max={response.budget} color={i === 0 ? theme.primary : i === 1 ? theme.accent : i === 2 ? theme.warn : theme.success} />
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid rgba(15,76,138,0.08)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <div>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: theme.primary }}>${response.used}</span>
                  <span style={{ fontSize: 12, color: theme.success, marginLeft: 8 }}>/ ${response.budget} budget</span>
                </div>
              </div>
              <Btn variant="accent" style={{ width: "100%", marginTop: 12 }} icon="✈">Book This Trip</Btn>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// NOTIFICATIONS PAGE (enhanced)
const Notifications = ({ onNavigate }) => {
  const [filter, setFilter] = useState("all");
  const [notifs, setNotifs] = useState(mockNotifications);

  const allNotifs = [
    ...mockNotifications,
    { id: "N005", type: "promo", title: "Flash Sale: 40% Off Business Class", msg: "Emirates Business Class HYD→DXB now at $534. Only 3 seats left. Offer ends tonight!", time: "2h ago", read: false },
    { id: "N006", type: "update", title: "Booking Updated", msg: "Your booking AEF-2035-78421 seat changed from 12A to 14C due to aircraft change.", time: "5h ago", read: true },
    { id: "N007", type: "delay", title: "Gate Change Alert", msg: "Your flight EK202 gate changed from A4 to B12. Please proceed to Terminal 2.", time: "8h ago", read: true },
    { id: "N008", type: "checkin", title: "Trip Reminder: Dubai in 3 Days", msg: "Don't forget to pack! Your trip to Dubai departs Mar 15. Check-in opens tomorrow.", time: "1d ago", read: true },
  ];

  const icons = { delay: "⚠️", price: "💰", checkin: "✅", points: "⭐", promo: "🎉", update: "📝" };
  const typeColors = { delay: theme.warn, price: theme.success, checkin: theme.accent, points: theme.gold, promo: theme.danger, update: theme.primary };
  const filters = ["all", "unread", "delay", "price", "checkin", "points", "promo"];
  const filtered = allNotifs.filter(n => filter === "all" ? true : filter === "unread" ? !n.read : n.type === filter);
  const unreadCount = allNotifs.filter(n => !n.read).length;

  return (
    <div className="fade-in">
      {/* Header Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🔔" label="Total Notifications" value={allNotifs.length} color={theme.primary} />
        <StatCard icon="🔴" label="Unread" value={unreadCount} color={theme.danger} />
        <StatCard icon="⚠️" label="Flight Alerts" value={allNotifs.filter(n => n.type === "delay").length} color={theme.warn} />
        <StatCard icon="💰" label="Price Alerts" value={allNotifs.filter(n => n.type === "price" || n.type === "promo").length} color={theme.success} />
      </div>

      <Card style={{ overflow: "hidden" }}>
        {/* Filter Tabs + Actions */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(15,76,138,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${filter === f ? theme.primary : "rgba(15,76,138,0.12)"}`, background: filter === f ? `${theme.primary}12` : "transparent", color: filter === f ? theme.primary : theme.textMid, fontSize: 12, fontWeight: filter === f ? 700 : 500, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {f === "all" ? `All (${allNotifs.length})` : f === "unread" ? `Unread (${unreadCount})` : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" size="sm" icon="✓">Mark All Read</Btn>
            <Btn variant="ghost" size="sm" icon="🗑">Clear All</Btn>
          </div>
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔕</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, color: theme.textMid }}>No notifications here</div>
          </div>
        ) : filtered.map((n, i) => (
          <div key={n.id} style={{ display: "flex", gap: 16, padding: "20px 24px", borderBottom: i < filtered.length - 1 ? "1px solid rgba(15,76,138,0.06)" : "none", background: n.read ? "transparent" : `${theme.primary}02`, transition: "background 0.2s", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = theme.sky}
            onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : `${theme.primary}02`}>
            {/* Icon bubble */}
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${typeColors[n.type]}15`, border: `1.5px solid ${typeColors[n.type]}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icons[n.type]}</div>
            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ fontWeight: n.read ? 500 : 700, fontSize: 14, color: theme.text, lineHeight: 1.4 }}>{n.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: theme.textLight, whiteSpace: "nowrap" }}>{n.time}</span>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, flexShrink: 0 }} />}
                </div>
              </div>
              <div style={{ fontSize: 13, color: theme.textMid, marginTop: 5, lineHeight: 1.6 }}>{n.msg}</div>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <Badge type={n.type === "delay" ? "warn" : n.type === "price" || n.type === "promo" ? "success" : n.type === "points" ? "gold" : "info"}>
                  {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                </Badge>
                {!n.read && <Btn variant="ghost" size="sm">Mark Read</Btn>}
                {(n.type === "price" || n.type === "promo") && <Btn variant="accent" size="sm" onClick={() => onNavigate("flight-search")}>View Deal →</Btn>}
                {n.type === "checkin" && <Btn variant="outline" size="sm">Check In</Btn>}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Notification Preferences */}
      <Card style={{ padding: 28, marginTop: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>⚙️ Notification Preferences</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { icon: "✈️", label: "Flight Delays & Gate Changes", enabled: true },
            { icon: "💰", label: "Price Drops & Deals", enabled: true },
            { icon: "🔔", label: "Booking Reminders", enabled: true },
            { icon: "⭐", label: "Loyalty Points Updates", enabled: false },
            { icon: "📢", label: "Promotions & Offers", enabled: false },
            { icon: "📱", label: "SMS Notifications", enabled: true },
          ].map((pref, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: theme.light, borderRadius: 12, border: "1px solid rgba(15,76,138,0.06)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{pref.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>{pref.label}</span>
              </div>
              {/* Toggle */}
              <div style={{ width: 44, height: 24, borderRadius: 12, background: pref.enabled ? theme.accent : "#ccc", position: "relative", cursor: "pointer", transition: "background 0.3s", flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: pref.enabled ? 23 : 3, transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// PROFILE PAGE
const ProfilePage = ({ onNavigate, role }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "personal", label: "Personal Info", icon: "📝" },
    { id: "travel", label: "Travel Preferences", icon: "✈️" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "payments", label: "Payment Methods", icon: "💳" },
    { id: "documents", label: "Documents", icon: "📄" },
  ];

  const recentActivity = [
    { icon: "✈️", title: "Booked flight to Dubai", sub: "EK202 · Mar 15, 2035", color: theme.primary },
    { icon: "⭐", title: "Earned 2,400 AeroPoints", sub: "From EK202 booking", color: theme.gold },
    { icon: "🏨", title: "Hotel added to trip", sub: "Burj Al Arab · Dubai", color: theme.accent },
    { icon: "💳", title: "Payment method added", sub: "Visa •••• 4521", color: theme.success },
    { icon: "🔔", title: "Price alert triggered", sub: "HYD→SIN dropped 12%", color: theme.warn },
  ];

  return (
    <div className="fade-in">
      {/* Profile Hero Card */}
      <Card style={{ marginBottom: 24, overflow: "visible" }}>
        {/* Cover */}
        <div style={{ height: 140, background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.primary} 60%, ${theme.accent} 100%)`, borderRadius: "16px 16px 0 0", position: "relative" }}>
          <div style={{ position: "absolute", top: 16, right: 20, display: "flex", gap: 8 }}>
            <Btn variant="ghost" size="sm" icon="📷" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)" }}>Change Cover</Btn>
          </div>
          {/* Avatar overlapping */}
          <div style={{ position: "absolute", bottom: -44, left: 32 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", border: "4px solid #fff", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>AK</div>
              <div style={{ position: "absolute", bottom: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: theme.success, border: "3px solid #fff" }} />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ padding: "56px 32px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 26, color: theme.text, letterSpacing: -0.5 }}>Arun Kumar</div>
            <div style={{ fontSize: 14, color: theme.textMid, marginTop: 4 }}>✉️ arun@aeroflow.ai · 📱 +91 98765 43210</div>
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <Badge type="gold">⭐ Gold Member</Badge>
              <Badge type="accent">✈️ 24 Trips</Badge>
              <Badge type="info">🌍 {role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
              <Badge type="success">🟢 Active</Badge>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant={editMode ? "accent" : "outline"} icon={editMode ? "✓" : "✏️"} onClick={() => setEditMode(!editMode)}>
              {editMode ? "Save Changes" : "Edit Profile"}
            </Btn>
            <Btn variant="ghost" icon="⚙️" onClick={() => onNavigate("admin-settings")}>Settings</Btn>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={{ borderTop: "1px solid rgba(15,76,138,0.08)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { label: "Total Trips", value: "24", icon: "✈️" },
            { label: "AeroPoints", value: "12,450", icon: "⭐" },
            { label: "CO₂ Saved", value: "840kg", icon: "🌿" },
            { label: "Member Since", value: "Jan 2034", icon: "🗓" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "20px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(15,76,138,0.08)" : "none" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: theme.text }}>{s.value}</div>
              <div style={{ fontSize: 12, color: theme.textLight, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#fff", padding: 6, borderRadius: 14, border: "1px solid rgba(15,76,138,0.06)", width: "fit-content", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "none", background: activeTab === t.id ? theme.primary : "transparent", color: activeTab === t.id ? "#fff" : theme.textMid, fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Recent Activity */}
          <Card style={{ padding: 24 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🕐 Recent Activity</div>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: theme.textLight }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Travel Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🌍 Travel Stats</div>
              {[
                { label: "Countries Visited", value: 8, max: 20, icon: "🗺️", color: theme.primary },
                { label: "Total Miles Flown", value: 48200, max: 100000, icon: "✈️", color: theme.accent },
                { label: "Eco Score", value: 84, max: 100, icon: "🌿", color: theme.success },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>{s.icon} {s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color }}>{typeof s.value === "number" && s.max <= 100 ? s.value : s.value.toLocaleString()}</span>
                  </div>
                  <ProgressBar value={s.value} max={s.max} color={s.color} />
                </div>
              ))}
            </Card>
            <Card style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🏆 Achievements</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: "🌏", title: "World Explorer", desc: "8 countries" },
                  { icon: "💎", title: "Frequent Flyer", desc: "20+ trips" },
                  { icon: "🌿", title: "Eco Traveler", desc: "840kg saved" },
                  { icon: "⭐", title: "Gold Member", desc: "12K+ points" },
                ].map((a, i) => (
                  <div key={i} style={{ padding: "12px", background: theme.sky, borderRadius: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{a.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: theme.textLight }}>{a.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "personal" && (
        <div className="fade-in">
          <Card style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18 }}>📝 Personal Information</div>
              {!editMode && <Btn variant="outline" size="sm" icon="✏️" onClick={() => setEditMode(true)}>Edit</Btn>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              <Input label="First Name" value="Arun" onChange={() => { }} />
              <Input label="Last Name" value="Kumar" onChange={() => { }} />
              <Input label="Email Address" value="arun@aeroflow.ai" type="email" icon="✉️" onChange={() => { }} />
              <Input label="Phone Number" value="+91 98765 43210" icon="📱" onChange={() => { }} />
              <Input label="Date of Birth" value="1990-06-15" type="date" onChange={() => { }} />
              <Select label="Gender" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} value="male" />
              <Input label="City" value="Hyderabad" icon="🏙" onChange={() => { }} />
              <Select label="Country" options={[{ value: "IN", label: "🇮🇳 India" }, { value: "AE", label: "🇦🇪 UAE" }, { value: "US", label: "🇺🇸 USA" }]} value="IN" />
            </div>
            <div style={{ paddingTop: 20, borderTop: "1px solid rgba(15,76,138,0.08)", display: "flex", gap: 12 }}>
              <Btn variant="primary" icon="✓">Save Changes</Btn>
              <Btn variant="ghost" onClick={() => setEditMode(false)}>Cancel</Btn>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "travel" && (
        <div className="fade-in">
          <Card style={{ padding: 32 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 28 }}>✈️ Travel Preferences</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Flight Preferences</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Select label="Preferred Cabin Class" options={[{ value: "economy", label: "Economy" }, { value: "business", label: "Business" }, { value: "first", label: "First Class" }]} value="economy" />
                  <Select label="Seat Preference" options={[{ value: "window", label: "🪟 Window" }, { value: "aisle", label: "🚶 Aisle" }, { value: "middle", label: "💺 Middle" }]} value="window" />
                  <Select label="Meal Preference" options={[{ value: "veg", label: "🥗 Vegetarian" }, { value: "nonveg", label: "🍗 Non-Veg" }, { value: "vegan", label: "🌱 Vegan" }]} value="veg" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Preferred Airlines</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Emirates", "Singapore Airlines", "IndiGo", "British Airways", "Air India"].map((a, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: theme.light, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, color: theme.text }}>
                      <input type="checkbox" defaultChecked={i < 2} style={{ accentColor: theme.primary, width: 16, height: 16 }} /> {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Btn variant="primary" icon="✓">Save Preferences</Btn>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "security" && (
        <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Card style={{ padding: 28 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 24 }}>🔑 Change Password</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              <Input label="Current Password" type="password" placeholder="••••••••" icon="🔒" />
              <Input label="New Password" type="password" placeholder="••••••••" icon="🔑" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" icon="✓" />
            </div>
            <Btn variant="primary" icon="🔒">Update Password</Btn>
          </Card>
          <Card style={{ padding: 28 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 24 }}>🛡️ Security Settings</div>
            {[
              { icon: "📱", title: "Two-Factor Authentication", desc: "Add an extra layer of security", enabled: true },
              { icon: "👁", title: "Biometric Login", desc: "Use fingerprint or face ID", enabled: true },
              { icon: "🔔", title: "Login Alerts", desc: "Get notified of new logins", enabled: false },
              { icon: "📍", title: "Location Tracking", desc: "Allow location-based features", enabled: true },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 3 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: theme.textLight }}>{s.desc}</div>
                  </div>
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: s.enabled ? theme.accent : "#ccc", position: "relative", cursor: "pointer", transition: "background 0.3s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: s.enabled ? 23 : 3, transition: "left 0.3s" }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="fade-in">
          <Card style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16 }}>💳 Saved Payment Methods</div>
              <Btn variant="primary" size="sm" icon="+">Add New Card</Btn>
            </div>
            {[
              { type: "Visa", last4: "4521", expiry: "12/37", icon: "💳", primary: true, color: "#1a1f71" },
              { type: "Mastercard", last4: "8832", expiry: "08/36", icon: "🔴", primary: false, color: "#eb001b" },
              { type: "AmEx", last4: "0021", expiry: "03/38", icon: "🔵", primary: false, color: "#007bc1" },
            ].map((card, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: theme.sky, borderRadius: 14, marginBottom: 12, border: card.primary ? `2px solid ${theme.accent}` : "2px solid transparent" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 52, height: 36, borderRadius: 8, background: card.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{card.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{card.type} •••• {card.last4}</div>
                    <div style={{ fontSize: 12, color: theme.textLight }}>Expires {card.expiry}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {card.primary && <Badge type="accent">Primary</Badge>}
                  <Btn variant="ghost" size="sm">Edit</Btn>
                  {!card.primary && <Btn variant="danger" size="sm">Remove</Btn>}
                </div>
              </div>
            ))}
          </Card>
          <Card style={{ padding: 28 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>💰 Billing History</div>
            {[
              { desc: "Flight EK202 – Dubai", amount: 460, date: "Mar 10", card: "Visa •4521", status: "paid" },
              { desc: "Flight SQ234 – Singapore", amount: 720, date: "Feb 20", card: "MC •8832", status: "paid" },
              { desc: "Flight BA142 – London", amount: 1250, date: "Feb 10", card: "Visa •4521", status: "paid" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{b.desc}</div>
                  <div style={{ fontSize: 12, color: theme.textLight }}>{b.date} · {b.card}</div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Badge type="success">{b.status}</Badge>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16, color: theme.primary }}>${b.amount}</span>
                  <Btn variant="ghost" size="sm">Receipt</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="fade-in">
          <Card style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16 }}>📄 Travel Documents</div>
              <Btn variant="primary" size="sm" icon="+">Upload Document</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {[
                { type: "Passport", icon: "🛂", number: "P1234567", country: "🇮🇳 India", expiry: "Mar 2030", status: "valid" },
                { type: "Visa – UAE", icon: "🇦🇪", number: "UAE-89321", country: "🇮🇳 India", expiry: "Dec 2035", status: "valid" },
                { type: "Visa – UK", icon: "🇬🇧", number: "UK-44821", country: "🇮🇳 India", expiry: "Jun 2025", status: "expired" },
                { type: "Travel Insurance", icon: "🛡️", number: "TI-22891", country: "Worldwide", expiry: "Dec 2035", status: "valid" },
              ].map((doc, i) => (
                <div key={i} style={{ padding: 20, background: theme.sky, borderRadius: 14, border: `1.5px solid ${doc.status === "expired" ? theme.danger + "40" : "rgba(15,76,138,0.06)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{doc.icon}</span>
                    <Badge type={doc.status === "valid" ? "success" : "danger"}>{doc.status}</Badge>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{doc.type}</div>
                  <div style={{ fontSize: 12, color: theme.textLight, marginBottom: 2 }}>No: {doc.number}</div>
                  <div style={{ fontSize: 12, color: theme.textLight, marginBottom: 2 }}>{doc.country}</div>
                  <div style={{ fontSize: 12, color: doc.status === "expired" ? theme.danger : theme.textLight, fontWeight: doc.status === "expired" ? 600 : 400 }}>Expires: {doc.expiry}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <Btn variant="ghost" size="sm">View</Btn>
                    {doc.status === "expired" && <Btn variant="accent" size="sm">Renew</Btn>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// LOYALTY PAGE
const Loyalty = () => {
  const points = 12450;
  const nextLevel = 15000;
  const progress = (points / nextLevel) * 100;

  return (
    <div className="fade-in">
      {/* Loyalty Card */}
      <div style={{ background: `linear-gradient(135deg, ${theme.dark}, ${theme.primary})`, borderRadius: 20, padding: 32, marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: `${theme.gold}15` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, color: theme.gold, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>GOLD MEMBER</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: -2, marginBottom: 4 }}>{points.toLocaleString()}</div>
            <div style={{ color: "rgba(255,255,255,0.6)" }}>AeroPoints Available</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 40 }}>🏆</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>Arun Kumar</div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
            <span>Gold {points.toLocaleString()}</span>
            <span>Platinum {nextLevel.toLocaleString()}</span>
          </div>
          <ProgressBar value={points} max={nextLevel} color={theme.gold} height={8} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{(nextLevel - points).toLocaleString()} points to Platinum</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="✈️" label="Total Miles" value="48,200" color={theme.primary} />
        <StatCard icon="🏨" label="Hotel Stays" value="18" color={theme.accent} />
        <StatCard icon="💎" label="Tier Benefits" value="12" color={theme.gold} />
        <StatCard icon="💰" label="Points Value" value="$248" sub="Redeemable" color={theme.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>🎁 Redeem Points</div>
          {[
            { reward: "Flight Upgrade", icon: "✈️", pts: 5000, val: "$50 off" },
            { reward: "Lounge Access", icon: "🛋", pts: 2000, val: "2 passes" },
            { reward: "Hotel Discount", icon: "🏨", pts: 3500, val: "$35 off" },
            { reward: "Cashback", icon: "💰", pts: 1000, val: "$10" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.reward}</div>
                  <div style={{ fontSize: 12, color: theme.textLight }}>{r.pts.toLocaleString()} pts = {r.val}</div>
                </div>
              </div>
              <Btn variant="outline" size="sm" disabled={r.pts > points}>Redeem</Btn>
            </div>
          ))}
        </Card>
        <Card style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>📊 Points History</div>
          {[
            { desc: "Flight EK202 – Dubai", pts: +2400, date: "Mar 10" },
            { desc: "Lounge Access Redeemed", pts: -2000, date: "Feb 28" },
            { desc: "Flight SQ234 – Singapore", pts: +3200, date: "Feb 20" },
            { desc: "Hotel Stay – Marriott", pts: +800, date: "Feb 15" },
          ].map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{h.desc}</div>
                <div style={{ fontSize: 11, color: theme.textLight }}>{h.date}</div>
              </div>
              <span style={{ fontWeight: 700, color: h.pts > 0 ? theme.success : theme.danger, fontSize: 14 }}>
                {h.pts > 0 ? "+" : ""}{h.pts.toLocaleString()}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// SUSTAINABILITY PAGE
const Sustainability = () => (
  <div className="fade-in">
    <Card style={{ padding: 32, marginBottom: 24, background: `linear-gradient(135deg, #0A2E1A, #0F4C2A)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>YOUR ECO IMPACT</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 40, color: "#fff", marginBottom: 8 }}>840 kg CO₂</div>
          <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Total carbon offset in 2035</div>
          <Badge type="success">🌿 Top 15% eco traveler</Badge>
        </div>
        <div style={{ fontSize: 80 }} className="float">🌍</div>
      </div>
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
      <StatCard icon="🌳" label="Trees Planted" value="42" color={theme.success} />
      <StatCard icon="♻️" label="Carbon Offset" value="840kg" color={theme.success} />
      <StatCard icon="✈️" label="Green Flights" value="18/24" color={theme.accent} />
      <StatCard icon="💚" label="Eco Score" value="84/100" color={theme.success} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>✈️ Flight CO₂ Comparison</div>
        {mockFlights.slice(0, 4).map((f, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{f.airline} – {f.from}→{f.to}</span>
              <span style={{ color: f.co2 < 250 ? theme.success : f.co2 < 350 ? theme.warn : theme.danger, fontWeight: 600 }}>{f.co2}kg</span>
            </div>
            <ProgressBar value={f.co2} max={500} color={f.co2 < 250 ? theme.success : f.co2 < 350 ? theme.warn : theme.danger} />
          </div>
        ))}
      </Card>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>💚 Carbon Offset Options</div>
        {[
          { name: "Plant Trees", icon: "🌳", per: "per tree", price: 5, desc: "Offset 21kg CO₂ per tree" },
          { name: "Solar Energy", icon: "☀️", per: "per unit", price: 12, desc: "Fund renewable energy projects" },
          { name: "Ocean Cleanup", icon: "🌊", per: "per contribution", price: 8, desc: "Support marine conservation" },
        ].map((o, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{o.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{o.name}</div>
                <div style={{ fontSize: 12, color: theme.textLight }}>{o.desc}</div>
              </div>
            </div>
            <Btn variant="accent" size="sm">${o.price}</Btn>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

// AGENT DASHBOARD
const AgentDashboard = ({ onNavigate }) => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
      <StatCard icon="📋" label="Active Bookings" value="142" trend={18} color={theme.primary} />
      <StatCard icon="👥" label="Total Clients" value="89" trend={7} color={theme.accent} />
      <StatCard icon="💰" label="Commission (MTD)" value="$4,280" trend={22} color={theme.success} />
      <StatCard icon="⭐" label="Satisfaction Rate" value="96.4%" trend={2} color={theme.gold} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>👥 Recent Clients</div>
        {[
          { name: "Priya Nair", trip: "Dubai", status: "booked", commission: 84 },
          { name: "Rahul Sharma", trip: "Singapore", status: "searching", commission: null },
          { name: "Anita Verma", trip: "London", status: "pending", commission: 145 },
          { name: "Kiran Mehta", trip: "Bangkok", status: "booked", commission: 62 },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
            <Avatar name={c.name} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: theme.textLight }}>✈ {c.trip}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Badge type={c.status === "booked" ? "success" : c.status === "searching" ? "info" : "warn"}>{c.status}</Badge>
              {c.commission && <div style={{ fontSize: 12, color: theme.success, marginTop: 4 }}>+${c.commission}</div>}
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>💰 Commission Breakdown</div>
        {[
          { month: "Mar 2035", amount: 4280, count: 38 },
          { month: "Feb 2035", amount: 3640, count: 32 },
          { month: "Jan 2035", amount: 3890, count: 35 },
        ].map((m, i) => (
          <div key={i} style={{ padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.month}</div>
                <div style={{ fontSize: 12, color: theme.textLight }}>{m.count} bookings</div>
              </div>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, color: theme.success }}>${m.amount.toLocaleString()}</span>
            </div>
            <ProgressBar value={m.amount} max={5000} color={theme.success} />
          </div>
        ))}
        <Btn variant="outline" size="sm" style={{ width: "100%", marginTop: 16 }}>View Full Report</Btn>
      </Card>
    </div>
  </div>
);

// CORPORATE DASHBOARD
const CorporateDashboard = ({ onNavigate }) => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
      <StatCard icon="👥" label="Employee Trips" value="28" sub="This month" trend={14} color={theme.primary} />
      <StatCard icon="⏳" label="Pending Approval" value="4" color={theme.warn} />
      <StatCard icon="💸" label="Travel Spend (MTD)" value="$48,200" trend={-8} color={theme.danger} />
      <StatCard icon="✅" label="Policy Compliance" value="94%" color={theme.success} />
    </div>

    <Card style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>👤 Employee Travel Requests</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{["Employee", "Department", "Destination", "Date", "Budget", "Status", "Action"].map(h => (
            <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: theme.textLight, borderBottom: "2px solid rgba(15,76,138,0.08)", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {employees.map((e, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(15,76,138,0.06)" }}>
              <td style={{ padding: "14px 12px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={e.name} size={32} /><span style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</span></div></td>
              <td style={{ padding: "14px 12px", fontSize: 13, color: theme.textMid }}>{e.dept}</td>
              <td style={{ padding: "14px 12px", fontSize: 13 }}>✈ {e.trip}</td>
              <td style={{ padding: "14px 12px", fontSize: 13, color: theme.textMid }}>{e.date}</td>
              <td style={{ padding: "14px 12px", fontSize: 13, fontWeight: 600, color: theme.primary }}>${e.budget}</td>
              <td style={{ padding: "14px 12px" }}><Badge type={e.status === "approved" ? "success" : "warn"}>{e.status}</Badge></td>
              <td style={{ padding: "14px 12px" }}>
                {e.status === "pending" ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="accent" size="sm">Approve</Btn>
                    <Btn variant="danger" size="sm">Reject</Btn>
                  </div>
                ) : <Btn variant="ghost" size="sm">View</Btn>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>📜 Travel Policy</div>
        {[
          { icon: "✈️", rule: "Economy class for domestic flights", limit: "$500/trip", status: "active" },
          { icon: "🏨", rule: "Hotel max $200/night", limit: "$200/night", status: "active" },
          { icon: "🍽", rule: "Meal allowance per diem", limit: "$60/day", status: "active" },
          { icon: "🚕", rule: "Airport transfer limit", limit: "$80/trip", status: "active" },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span>{p.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.rule}</div>
                <div style={{ fontSize: 12, color: theme.textLight }}>Limit: {p.limit}</div>
              </div>
            </div>
            <Badge type="success">Active</Badge>
          </div>
        ))}
      </Card>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>📊 Expense Summary</div>
        {[
          { dept: "Engineering", spend: 18400, budget: 25000 },
          { dept: "Sales", spend: 14200, budget: 20000 },
          { dept: "Marketing", spend: 9800, budget: 15000 },
          { dept: "HR", spend: 5800, budget: 8000 },
        ].map((d, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 600 }}>{d.dept}</span>
              <span style={{ color: theme.textMid }}>${d.spend.toLocaleString()} / ${d.budget.toLocaleString()}</span>
            </div>
            <ProgressBar value={d.spend} max={d.budget} color={d.spend / d.budget > 0.85 ? theme.warn : theme.primary} />
          </div>
        ))}
      </Card>
    </div>
  </div>
);

// ADMIN DASHBOARD
const AdminDashboard = () => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
      <StatCard icon="📋" label="Total Bookings" value="128,420" trend={18} color={theme.primary} />
      <StatCard icon="👥" label="Active Users" value="84,200" trend={24} color={theme.accent} />
      <StatCard icon="💰" label="Revenue (MTD)" value="$1.92M" trend={12} color={theme.success} />
      <StatCard icon="✈️" label="Airlines" value="48" color={theme.mid} />
      <StatCard icon="🛡️" label="Fraud Detected" value="12" sub="0.01% rate" color={theme.danger} />
      <StatCard icon="⚡" label="Avg Response" value="0.42s" color={theme.accent} />
    </div>

    {/* Analytics Chart */}
    <Card style={{ padding: 28, marginBottom: 24 }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>📈 Platform Analytics</div>
      <div style={{ display: "flex", gap: 32, alignItems: "flex-end", height: 200 }}>
        {analyticsData.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 11, color: theme.textMid, fontWeight: 600 }}>{d.revenue / 1000}K</div>
            <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: `linear-gradient(180deg, ${theme.accent}, ${theme.primary})`, height: (d.revenue / 200000) * 160, transition: "height 0.5s ease", minHeight: 8 }} />
            <div style={{ fontSize: 12, color: theme.textLight }}>{d.month}</div>
          </div>
        ))}
      </div>
    </Card>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Popular Routes */}
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>🗺️ Popular Routes</div>
        {popularRoutes.map((r, i) => (
          <div key={i} style={{ padding: "12px 0", borderBottom: i < 4 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.route}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: theme.textMid }}>{r.bookings.toLocaleString()}</span>
                <Badge type="success">+{r.growth}%</Badge>
              </div>
            </div>
            <ProgressBar value={r.bookings} max={5000} color={i === 0 ? theme.primary : i === 1 ? theme.accent : theme.mid} />
          </div>
        ))}
      </Card>

      {/* Fraud Monitor */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700 }}>🛡️ Fraud Monitor</div>
          <Badge type="success">System Healthy</Badge>
        </div>
        {[
          { type: "Card Fraud Attempt", user: "IP: 192.168.4.21", time: "2m ago", risk: "high", icon: "💳" },
          { type: "Multiple Failed Logins", user: "user_4829@gmail.com", time: "15m ago", risk: "medium", icon: "🔑" },
          { type: "Unusual Booking Pattern", user: "agent_id_482", time: "1h ago", risk: "low", icon: "📊" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.risk === "high" ? theme.danger : f.risk === "medium" ? theme.warn : theme.success}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{f.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{f.type}</div>
              <div style={{ fontSize: 11, color: theme.textLight }}>{f.user} · {f.time}</div>
            </div>
            <Badge type={f.risk === "high" ? "danger" : f.risk === "medium" ? "warn" : "success"}>{f.risk}</Badge>
          </div>
        ))}
        <Btn variant="outline" size="sm" style={{ width: "100%", marginTop: 16 }}>View All Alerts</Btn>
      </Card>
    </div>
  </div>
);

// ADMIN ANALYTICS
const AdminAnalytics = () => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 24 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 16 }}>📊 Monthly Revenue</div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 120 }}>
          {analyticsData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", borderRadius: 4, background: `linear-gradient(180deg, ${theme.accent}, ${theme.primary})`, height: (d.revenue / 200000) * 100 }} />
              <div style={{ fontSize: 10, color: theme.textLight }}>{d.month}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 16 }}>🔄 Conversion Rate</div>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 48, color: theme.primary, letterSpacing: -2 }}>4.8%</div>
          <div style={{ color: theme.success, fontWeight: 600, fontSize: 14 }}>↑ 0.4% vs last month</div>
          <div style={{ fontSize: 13, color: theme.textLight, marginTop: 8 }}>Industry avg: 3.2%</div>
        </div>
      </Card>
      <Card style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 16 }}>⚡ Performance</div>
        {[["Search Response", "0.42s", theme.success], ["Booking Confirm", "1.8s", theme.success], ["API Uptime", "99.98%", theme.success], ["Error Rate", "0.02%", theme.accent]].map(([l, v, c], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: i < 3 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
            <span style={{ color: theme.textMid }}>{l}</span>
            <span style={{ fontWeight: 700, color: c }}>{v}</span>
          </div>
        ))}
      </Card>
    </div>

    <Card style={{ padding: 24 }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>📋 Booking Analytics</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{["Month", "Bookings", "Revenue", "Avg Value", "Conversion", "Growth"].map(h => (
            <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, color: theme.textLight, borderBottom: "2px solid rgba(15,76,138,0.08)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {analyticsData.map((d, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(15,76,138,0.05)" }}>
              <td style={{ padding: "14px 16px", fontWeight: 600 }}>{d.month} 2035</td>
              <td style={{ padding: "14px 16px", color: theme.textMid }}>{d.bookings.toLocaleString()}</td>
              <td style={{ padding: "14px 16px", fontWeight: 600, color: theme.primary }}>${(d.revenue / 1000).toFixed(0)}K</td>
              <td style={{ padding: "14px 16px", color: theme.textMid }}>${Math.round(d.revenue / d.bookings)}</td>
              <td style={{ padding: "14px 16px" }}><Badge type="info">{d.conversion}%</Badge></td>
              <td style={{ padding: "14px 16px", color: theme.success, fontWeight: 600 }}>↑ {(Math.random() * 20 + 8).toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

// ADMIN USERS
const AdminUsers = () => {
  const users = [
    { name: "Priya Nair", email: "priya@email.com", role: "Traveler", bookings: 12, joined: "Jan 2035", status: "active" },
    { name: "Rahul Sharma", email: "rahul@corp.in", role: "Corporate", bookings: 45, joined: "Oct 2034", status: "active" },
    { name: "Anita Verma", email: "anita@agency.in", role: "Agent", bookings: 128, joined: "Mar 2034", status: "active" },
    { name: "Kiran Mehta", email: "kiran@email.com", role: "Traveler", bookings: 3, joined: "Feb 2035", status: "suspended" },
    { name: "Suresh Iyer", email: "suresh@corp.in", role: "Corporate", bookings: 22, joined: "Nov 2034", status: "active" },
  ];
  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Input placeholder="Search users..." icon="🔍" style={{ width: 280 }} />
          <Select options={[{ value: "all", label: "All Roles" }, { value: "traveler", label: "Traveler" }, { value: "agent", label: "Agent" }, { value: "corporate", label: "Corporate" }]} value="all" />
        </div>
        <Btn variant="primary" icon="+">Add User</Btn>
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["User", "Role", "Bookings", "Joined", "Status", "Actions"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, fontWeight: 700, color: theme.textLight, borderBottom: "2px solid rgba(15,76,138,0.08)", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} style={{ borderBottom: i < users.length - 1 ? "1px solid rgba(15,76,138,0.05)" : "none" }}>
                <td style={{ padding: "16px 20px" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar name={u.name} size={36} /><div><div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div><div style={{ fontSize: 12, color: theme.textLight }}>{u.email}</div></div></div></td>
                <td style={{ padding: "16px 20px" }}><Badge type={u.role === "Agent" ? "accent" : u.role === "Corporate" ? "info" : "neutral"}>{u.role}</Badge></td>
                <td style={{ padding: "16px 20px", fontWeight: 600 }}>{u.bookings}</td>
                <td style={{ padding: "16px 20px", color: theme.textLight, fontSize: 13 }}>{u.joined}</td>
                <td style={{ padding: "16px 20px" }}><Badge type={u.status === "active" ? "success" : "danger"}>{u.status}</Badge></td>
                <td style={{ padding: "16px 20px" }}><div style={{ display: "flex", gap: 8 }}><Btn variant="ghost" size="sm">Edit</Btn><Btn variant="danger" size="sm">Suspend</Btn></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ADMIN AIRLINES
const AdminAirlines = () => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
      <StatCard icon="✈️" label="Integrated Airlines" value="48" color={theme.primary} />
      <StatCard icon="🔗" label="GDS Connections" value="3" sub="Amadeus, Sabre, Travelport" color={theme.accent} />
      <StatCard icon="📡" label="Active APIs" value="142" color={theme.success} />
      <StatCard icon="⚡" label="API Uptime" value="99.96%" color={theme.success} />
    </div>
    <Card style={{ padding: 24 }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, marginBottom: 20 }}>✈️ Airline Integrations</div>
      {[
        { name: "Emirates", code: "EK", routes: 142, status: "active", gds: "Amadeus" },
        { name: "Singapore Airlines", code: "SQ", routes: 98, status: "active", gds: "Sabre" },
        { name: "British Airways", code: "BA", routes: 187, status: "active", gds: "Travelport" },
        { name: "IndiGo", code: "6E", routes: 84, status: "active", gds: "Amadeus" },
        { name: "Air Arabia", code: "G9", routes: 56, status: "maintenance", gds: "Sabre" },
      ].map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: i < 4 ? "1px solid rgba(15,76,138,0.06)" : "none" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${theme.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 14, color: theme.primary }}>{a.code}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: theme.textLight }}>{a.routes} routes · {a.gds}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Badge type={a.status === "active" ? "success" : "warn"}>{a.status}</Badge>
            <Btn variant="ghost" size="sm">Configure</Btn>
          </div>
        </div>
      ))}
    </Card>
  </div>
);

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function AeroFlow() {
  const [role, setRole] = useState("traveler");
  const [page, setPage] = useState("traveler-home");
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    const defaults = { traveler: "traveler-home", agent: "agent-home", corporate: "corporate-home", admin: "admin-home" };
    setPage(defaults[role] || "traveler-home");
  }, [role]);

  const pageTitles = {
    "traveler-home": ["Dashboard", "Welcome back, Arun"],
    "flight-search": ["Search Flights", "Find the best deals"],
    "my-trips": ["My Trips", "Manage your journeys"],
    "ai-planner": ["AI Travel Planner", "Let AI plan your trip"],
    "bookings": ["Bookings", "Your booking history"],
    "notifications": ["Notifications", "Stay updated"],
    "loyalty": ["Loyalty Program", "Your rewards & points"],
    "sustainability": ["Sustainability", "Your eco footprint"],
    "checkout": ["Book Flight", "Complete your booking"],
    "agent-home": ["Agent Dashboard", "Manage client bookings"],
    "agent-clients": ["Clients", "Manage your clients"],
    "agent-bookings": ["Manage Bookings", "All bookings"],
    "agent-commission": ["Commission", "Track your earnings"],
    "corporate-home": ["Corporate Dashboard", "Company travel overview"],
    "corporate-employees": ["Employee Travel", "Manage team trips"],
    "corporate-approvals": ["Approvals", "Pending requests"],
    "corporate-analytics": ["Travel Analytics", "Company insights"],
    "corporate-policy": ["Travel Policy", "Policy management"],
    "corporate-expenses": ["Expenses", "Expense tracking"],
    "admin-home": ["Platform Overview", "AeroFlow admin"],
    "admin-analytics": ["Analytics", "Platform performance"],
    "admin-users": ["User Management", "Manage users"],
    "admin-airlines": ["Airline Integrations", "Manage airline APIs"],
    "admin-bookings": ["All Bookings", "Platform bookings"],
    "admin-fraud": ["Fraud Monitor", "Security alerts"],
    "admin-settings": ["Settings", "Platform configuration"],
    "profile": ["My Profile", "Account & preferences"],
  };

  const [title, subtitle] = pageTitles[page] || ["AeroFlow", ""];

  const renderPage = () => {
    const props = { onNavigate: setPage, role };
    switch (page) {
      case "traveler-home": return <TravelerHome {...props} />;
      case "flight-search": return <FlightSearch {...props} onFlightSelect={setSelectedFlight} />;
      case "checkout": return <Checkout {...props} flight={selectedFlight} />;
      case "my-trips": return <MyTrips {...props} />;
      case "ai-planner": return <AIPlanner {...props} />;
      case "notifications": return <Notifications {...props} />;
      case "loyalty": return <Loyalty {...props} />;
      case "sustainability": return <Sustainability {...props} />;
      case "bookings": return <MyTrips {...props} />;
      case "profile": return <ProfilePage {...props} />;
      case "agent-home": case "agent-clients": case "agent-bookings": case "agent-commission": return <AgentDashboard {...props} />;
      case "corporate-home": case "corporate-employees": case "corporate-approvals": case "corporate-policy": case "corporate-expenses": return <CorporateDashboard {...props} />;
      case "corporate-analytics": return <AdminAnalytics />;
      case "admin-home": return <AdminDashboard />;
      case "admin-analytics": return <AdminAnalytics />;
      case "admin-users": return <AdminUsers />;
      case "admin-airlines": return <AdminAirlines />;
      case "admin-bookings": return <AdminDashboard />;
      case "admin-fraud": return <AdminDashboard />;
      case "admin-settings": return (
        <Card style={{ padding: 32 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>⚙️ Platform Settings</div>
          <div style={{ display: "grid", gap: 20 }}>
            {[["Platform Name", "AeroFlow"], ["Default Currency", "USD"], ["Booking Expiry (mins)", "30"], ["Max Search Results", "200"]].map(([l, v], i) => (
              <Input key={i} label={l} value={v} />
            ))}
            <Btn variant="primary">Save Settings</Btn>
          </div>
        </Card>
      );
      default: return <TravelerHome {...props} />;
    }
  };

  const unreadNotifs = mockNotifications.filter(n => !n.read).length;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: theme.light, width: "100%" }}>
        <Sidebar role={role} currentPage={page} onNavigate={setPage} />
        <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", width: "calc(100% - 240px)", overflowX: "hidden" }}>
          <TopBar title={title} subtitle={subtitle} role={role} onRoleChange={r => setRole(r)} notifCount={unreadNotifs} onNavigate={setPage} />
          <main style={{ flex: 1, padding: "28px 32px", width: "100%" }}>
            {renderPage()}
          </main>
          <footer style={{ padding: "20px 32px", borderTop: "1px solid rgba(15,76,138,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: theme.textLight }}>© 2035 AeroFlow · Next-Gen Flight Booking</div>
            <div style={{ display: "flex", gap: 16 }}>
              {["Amadeus", "Sabre", "Travelport"].map(p => (
                <span key={p} style={{ fontSize: 11, color: theme.textLight, background: theme.sky, padding: "3px 10px", borderRadius: 20 }}>{p}</span>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
