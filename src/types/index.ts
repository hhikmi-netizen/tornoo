export type WaitLevel = "low" | "mod" | "high";
export type Lang = "fr" | "ar" | "en";

export interface Establishment {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string;
  city: string;
  distance?: number;
  rating: number;
  reviewCount: number;
  waitMinutes: number;
  waitLevel: WaitLevel;
  isOpen: boolean;
  openHours: string;
  imageUrl: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  services: Service[];
  coordinates: { lat: number; lng: number };
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price?: number;
  currency?: string;
}

export interface Queue {
  id: string;
  establishmentId: string;
  serviceId: string;
  serviceName: string;
  label: string;
  currentTicket: string;
  waitingCount: number;
  estimatedWaitMinutes: number;
  isOpen: boolean;
  servedToday: number;
}

export interface Ticket {
  id: string;
  number: string;
  queueId: string;
  establishmentId: string;
  establishmentSlug: string;
  establishmentName: string;
  serviceName: string;
  position: number;
  estimatedWaitMinutes: number;
  estimatedTime: string;
  status: "waiting" | "called" | "served" | "cancelled";
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "turn" | "reminder" | "promo" | "system";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  establishmentId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "client" | "pro" | "admin";
  favorites: string[];
}

export interface ProProfile {
  id: string;
  userId: string;
  establishmentId: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  stats: {
    servedToday: number;
    waitingNow: number;
    avgWaitMinutes: number;
    rating: number;
  };
}

export interface DailyStats {
  date: string;
  clientsServed: number;
  avgWaitMinutes: number;
  revenue?: number;
  peakHour: string;
}
