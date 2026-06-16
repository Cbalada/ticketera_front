export type Role = 'USER' | 'ADMIN';

export type Sector = 'VIP' | 'CAMPO' | 'PLATEA_A' | 'PLATEA_B';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface EventSector {
  id: number;
  eventId: number;
  sector: Sector;
  price: string; // El API lo devuelve como string (ej. "30000.00")
  capacity: number;
  availableQuantity: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string; // ISO string
  sectors: EventSector[];
}

export interface Reservation {
  id: number;
  userId: number;
  eventSectorId: number;
  quantity: number;
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
  eventSector?: EventSector;
}

export interface Purchase {
  id: number;
  userId: number;
  reservationId: number;
  totalAmount: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  createdAt: string;
}

export interface EventSales {
  eventId: number;
  title: string;
  sales: number;
  revenue: number;
  ticketsSold: number;
}

export interface AdminSalesReport {
  totalSales: number;
  totalRevenue: number;
  ticketsSold: number;
  ticketsAvailable: number;
  salesByEvent: EventSales[];
  topEvents: EventSales[];
}

// Websocket Payloads
export interface StockPayload {
  eventId: number;
  sector: Sector;
  availableQuantity: number;
}

export interface ReservationCreatedPayload {
  reservationId: number;
  eventId: number;
  sector: Sector;
  availableQuantity: number;
}

export interface PurchaseCompletedPayload {
  purchaseId: number;
  reservationId: number;
}
