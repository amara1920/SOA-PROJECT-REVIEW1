import { demoAccounts, mockUsers } from '@/lib/mock-data';
import type { AuthSession, AuthUser, UserRole, Department } from '@/types';

function generateMockToken(user: AuthUser): string {
  // MOCK TOKEN — not a real JWT. Real JWT generation happens in Spring Security.
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    iat: Date.now(),
    exp: Date.now() + 86400000,
  };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 600));
    const account = demoAccounts.find(
      (a) => a.email === email && a.password === password
    );
    if (!account) {
      throw new Error('Invalid email or password. Use a demo account to sign in.');
    }
    const user: AuthUser = {
      id: mockUsers.find((u) => u.email === account.email)?.id || 'U001',
      name: account.name,
      email: account.email,
      role: account.role as UserRole,
      department: account.department as Department,
    };
    return { token: generateMockToken(user), user };
  },

  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: string;
  }): Promise<{ success: true }> {
    await new Promise((r) => setTimeout(r, 700));
    // Mock: always succeeds. Public signup defaults to EMPLOYEE role.
    return { success: true };
  },

  async forgotPassword(email: string): Promise<{ success: true }> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true };
  },

  async resetPassword(
    _token: string,
    _newPassword: string
  ): Promise<{ success: true }> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true };
  },

  async refreshToken(token: string): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 300));
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user: AuthUser = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      department: payload.department,
    };
    return { token: generateMockToken(user), user };
  },
};
