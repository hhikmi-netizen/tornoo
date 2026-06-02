import type { Establishment, Queue, Ticket, Notification, User, DailyStats } from "@/types";
import {
  MOCK_ESTABLISHMENTS,
  MOCK_QUEUES,
  MOCK_TICKET,
  MOCK_NOTIFICATIONS,
  MOCK_USER,
  MOCK_DAILY_STATS,
} from "@/lib/mock-data";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const api = {
  establishments: {
    list: async (query?: string): Promise<Establishment[]> => {
      await delay();
      if (!query) return MOCK_ESTABLISHMENTS;
      const q = query.toLowerCase();
      return MOCK_ESTABLISHMENTS.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    },
    bySlug: async (slug: string): Promise<Establishment | null> => {
      await delay();
      return MOCK_ESTABLISHMENTS.find((e) => e.slug === slug) ?? null;
    },
    favorites: async (ids: string[]): Promise<Establishment[]> => {
      await delay(200);
      return MOCK_ESTABLISHMENTS.filter((e) => ids.includes(e.id));
    },
  },
  queues: {
    byEstablishment: async (id: string): Promise<Queue[]> => {
      await delay(300);
      return MOCK_QUEUES.filter((q) => q.establishmentId === id);
    },
    join: async (_queueId: string): Promise<Ticket> => {
      await delay(600);
      return MOCK_TICKET;
    },
  },
  tickets: {
    active: async (): Promise<Ticket | null> => {
      await delay(300);
      return MOCK_TICKET;
    },
    byId: async (_id: string): Promise<Ticket> => {
      await delay(300);
      return MOCK_TICKET;
    },
    cancel: async (_id: string): Promise<void> => {
      await delay(400);
    },
  },
  notifications: {
    list: async (): Promise<Notification[]> => {
      await delay(300);
      return MOCK_NOTIFICATIONS;
    },
    markRead: async (_id: string): Promise<void> => {
      await delay(200);
    },
  },
  user: {
    me: async (): Promise<User> => {
      await delay(300);
      return MOCK_USER;
    },
    toggleFavorite: async (_estId: string): Promise<string[]> => {
      await delay(200);
      return MOCK_USER.favorites;
    },
  },
  pro: {
    stats: async (): Promise<DailyStats[]> => {
      await delay(400);
      return MOCK_DAILY_STATS;
    },
  },
};
