// ─── TYPES ────────────────────────────────────────────────────────────────────

export type PricePrediction = 'up' | 'down' | 'stable';
export type TripStatus = 'upcoming' | 'completed' | 'cancelled';
export type NotificationType = 'delay' | 'price' | 'checkin' | 'points' | 'promo' | 'update';
export type UserRole = 'traveler' | 'agent' | 'corporate' | 'admin';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
export type EmployeeRequestStatus = 'approved' | 'pending' | 'rejected';

export interface Flight {
  id: string;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  airline: string;
  logo: string;
  date: string;
  dep: string;
  arr: string;
  duration: string;
  stops: number;
  price: number;
  co2: number;
  rating: number;
  seats: number;
  class: string;
  prediction: PricePrediction;
  confidence: number;
}

export interface Trip {
  id: string;
  destination: string;
  date: string;
  status: TripStatus;
  flight: string;
  hotel: string;
  days: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

export interface AnalyticsData {
  month: string;
  bookings: number;
  revenue: number;
  conversion: number;
}

export interface PopularRoute {
  route: string;
  bookings: number;
  growth: number;
}

export interface Employee {
  id: string;
  name: string;
  dept: string;
  trip: string;
  date: string;
  status: EmployeeRequestStatus;
  budget: number;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

export const mockFlights: Flight[] = [
  {
    id: 'F001', from: 'HYD', to: 'DXB', fromCity: 'Hyderabad', toCity: 'Dubai',
    airline: 'Emirates', logo: '✈', date: '2035-03-15', dep: '06:30', arr: '08:45',
    duration: '3h 15m', stops: 0, price: 420, co2: 180, rating: 4.8, seats: 12,
    class: 'Economy', prediction: 'up', confidence: 87,
  },
  {
    id: 'F002', from: 'HYD', to: 'DXB', fromCity: 'Hyderabad', toCity: 'Dubai',
    airline: 'IndiGo', logo: '🛫', date: '2035-03-15', dep: '10:15', arr: '12:40',
    duration: '3h 25m', stops: 0, price: 320, co2: 320, rating: 4.2, seats: 45,
    class: 'Economy', prediction: 'stable', confidence: 72,
  },
  {
    id: 'F003', from: 'HYD', to: 'DXB', fromCity: 'Hyderabad', toCity: 'Dubai',
    airline: 'Air Arabia', logo: '🛩', date: '2035-03-15', dep: '14:00', arr: '17:30',
    duration: '4h 30m', stops: 1, price: 285, co2: 420, rating: 3.9, seats: 8,
    class: 'Economy', prediction: 'down', confidence: 65,
  },
  {
    id: 'F004', from: 'HYD', to: 'DXB', fromCity: 'Hyderabad', toCity: 'Dubai',
    airline: 'Emirates', logo: '✈', date: '2035-03-15', dep: '20:00', arr: '22:15',
    duration: '3h 15m', stops: 0, price: 890, co2: 180, rating: 4.9, seats: 3,
    class: 'Business', prediction: 'up', confidence: 91,
  },
  {
    id: 'F005', from: 'BLR', to: 'SIN', fromCity: 'Bangalore', toCity: 'Singapore',
    airline: 'Singapore Air', logo: '🦁', date: '2035-03-20', dep: '23:55', arr: '06:30',
    duration: '5h 35m', stops: 0, price: 680, co2: 210, rating: 4.9, seats: 6,
    class: 'Economy', prediction: 'up', confidence: 89,
  },
  {
    id: 'F006', from: 'DEL', to: 'LHR', fromCity: 'New Delhi', toCity: 'London',
    airline: 'British Airways', logo: '🇬🇧', date: '2035-03-18', dep: '02:15', arr: '07:45',
    duration: '8h 30m', stops: 0, price: 1150, co2: 540, rating: 4.6, seats: 22,
    class: 'Economy', prediction: 'stable', confidence: 78,
  },
];

export const mockTrips: Trip[] = [
  { id: 'T001', destination: 'Dubai', date: 'Mar 15, 2035', status: 'upcoming', flight: 'F001', hotel: 'Burj Al Arab', days: 4 },
  { id: 'T002', destination: 'Singapore', date: 'Mar 20, 2035', status: 'upcoming', flight: 'F005', hotel: 'Marina Bay Sands', days: 3 },
  { id: 'T003', destination: 'London', date: 'Feb 10, 2035', status: 'completed', flight: 'F006', hotel: 'The Savoy', days: 7 },
];

export const mockNotifications: Notification[] = [
  { id: 'N001', type: 'delay', title: 'Flight Delay Alert', msg: 'EK202 delayed by 45 mins. New boarding: 21:15 at Gate B12', time: '5m ago', read: false },
  { id: 'N002', type: 'price', title: 'Price Drop Detected', msg: 'HYD→DXB dropped to ₹24,800. Book now before it changes!', time: '1h ago', read: false },
  { id: 'N003', type: 'checkin', title: 'Check-in Open', msg: 'Online check-in for EK202 is now available', time: '3h ago', read: true },
  { id: 'N004', type: 'points', title: 'Points Earned', msg: 'You earned 2,400 AeroPoints from your last booking!', time: '1d ago', read: true },
  { id: 'N005', type: 'promo', title: 'Flash Sale: 40% Off Business Class', msg: 'Emirates Business Class HYD→DXB now at $534. Only 3 seats left. Offer ends tonight!', time: '2h ago', read: false },
  { id: 'N006', type: 'update', title: 'Booking Updated', msg: 'Your booking AEF-2035-78421 seat changed from 12A to 14C due to aircraft change.', time: '5h ago', read: true },
  { id: 'N007', type: 'delay', title: 'Gate Change Alert', msg: 'Your flight EK202 gate changed from A4 to B12. Please proceed to Terminal 2.', time: '8h ago', read: true },
  { id: 'N008', type: 'checkin', title: 'Trip Reminder: Dubai in 3 Days', msg: "Don't forget to pack! Your trip to Dubai departs Mar 15. Check-in opens tomorrow.", time: '1d ago', read: true },
];

export const analyticsData: AnalyticsData[] = [
  { month: 'Oct', bookings: 1240, revenue: 84000,  conversion: 3.2 },
  { month: 'Nov', bookings: 1580, revenue: 102000, conversion: 3.8 },
  { month: 'Dec', bookings: 2100, revenue: 148000, conversion: 4.1 },
  { month: 'Jan', bookings: 1890, revenue: 127000, conversion: 3.9 },
  { month: 'Feb', bookings: 2340, revenue: 164000, conversion: 4.4 },
  { month: 'Mar', bookings: 2680, revenue: 192000, conversion: 4.8 },
];

export const popularRoutes: PopularRoute[] = [
  { route: 'HYD → DXB', bookings: 4820, growth: 18 },
  { route: 'BLR → SIN', bookings: 3940, growth: 24 },
  { route: 'DEL → LHR', bookings: 3210, growth: 9  },
  { route: 'MUM → JFK', bookings: 2870, growth: 31 },
  { route: 'HYD → BLR', bookings: 2540, growth: 15 },
];

export const mockEmployees: Employee[] = [
  { id: 'E001', name: 'Arjun Sharma',  dept: 'Engineering', trip: 'Singapore', date: 'Mar 20', status: 'approved', budget: 1200 },
  { id: 'E002', name: 'Priya Nair',    dept: 'Sales',       trip: 'Dubai',     date: 'Mar 18', status: 'pending',  budget: 800  },
  { id: 'E003', name: 'Rahul Verma',   dept: 'Marketing',   trip: 'London',    date: 'Apr 5',  status: 'pending',  budget: 1800 },
  { id: 'E004', name: 'Sneha Iyer',    dept: 'HR',          trip: 'Bangkok',   date: 'Mar 28', status: 'approved', budget: 950  },
];
