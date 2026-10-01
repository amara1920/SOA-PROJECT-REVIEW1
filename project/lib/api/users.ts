import { mockUsers } from '@/lib/mock-data';
import type { User, UserRole } from '@/types';

// Simulate mutable state for mock mode
let users = [...mockUsers];

export const usersApi = {
  async list(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 300));
    return [...users];
  },

  async get(id: string): Promise<User | null> {
    await new Promise((r) => setTimeout(r, 200));
    return users.find((u) => u.id === id) || null;
  },

  async updateRole(id: string, role: UserRole): Promise<User> {
    await new Promise((r) => setTimeout(r, 400));
    users = users.map((u) => (u.id === id ? { ...u, role } : u));
    return users.find((u) => u.id === id)!;
  },

  async toggleStatus(id: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 400));
    users = users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    );
    return users.find((u) => u.id === id)!;
  },
};
