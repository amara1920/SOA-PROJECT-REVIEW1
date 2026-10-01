import { mockNotifications } from '@/lib/mock-data';
import type { AppNotification } from '@/types';

let notifications = [...mockNotifications];

export const notificationsApi = {
  async list(): Promise<AppNotification[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...notifications];
  },

  async markRead(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  },

  async markAllRead(): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    notifications = notifications.map((n) => ({ ...n, read: true }));
  },

  async delete(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    notifications = notifications.filter((n) => n.id !== id);
  },

  async unreadCount(): Promise<number> {
    await new Promise((r) => setTimeout(r, 100));
    return notifications.filter((n) => !n.read).length;
  },
};
