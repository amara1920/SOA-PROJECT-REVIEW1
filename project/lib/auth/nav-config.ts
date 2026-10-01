import type { NavItem, UserRole } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE'] },
  { label: 'Expenses', href: '/expenses', icon: 'Receipt', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE'] },
  { label: 'Budgets', href: '/budgets', icon: 'Wallet', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'] },
  { label: 'Approvals', href: '/approvals', icon: 'CheckCircle', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'] },
  { label: 'Reconciliation', href: '/reconciliation', icon: 'Scale', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'] },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'] },
  { label: 'Users', href: '/users', icon: 'Users', roles: ['ADMIN'] },
  { label: 'Architecture', href: '/architecture', icon: 'Network', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE'] },
  { label: 'Requirements', href: '/requirements', icon: 'FileText', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE'] },
  { label: 'Review 1', href: '/review1', icon: 'GraduationCap', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE'] },
  { label: 'Notifications', href: '/notifications', icon: 'Bell', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE'] },
  { label: 'Settings', href: '/settings', icon: 'Settings', roles: ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER', 'EMPLOYEE'] },
];

export const protectedRoutes = [
  '/dashboard',
  '/expenses',
  '/budgets',
  '/approvals',
  '/reconciliation',
  '/analytics',
  '/users',
  '/notifications',
  '/profile',
  '/settings',
  '/architecture',
  '/requirements',
  '/review1',
];

export const roleRoutes: Record<string, UserRole[]> = {
  '/users': ['ADMIN'],
  '/budgets': ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'],
  '/approvals': ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'],
  '/reconciliation': ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'],
  '/analytics': ['ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER'],
};

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return navItems.filter((item) => item.roles.includes(role));
}

export function isRouteAllowed(pathname: string, role: UserRole): boolean {
  for (const [prefix, roles] of Object.entries(roleRoutes)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return roles.includes(role);
    }
  }
  return true;
}
