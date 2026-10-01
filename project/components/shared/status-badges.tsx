'use client';

import { Badge } from '@/components/ui/badge';
import type { ExpenseStatus, BudgetStatus } from '@/types';
import { cn } from '@/lib/utils';

export function ExpenseStatusBadge({ status }: { status: ExpenseStatus }) {
  const styles: Record<ExpenseStatus, string> = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    Rejected: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };
  return (
    <Badge variant="outline" className={cn('font-medium', styles[status])}>
      {status}
    </Badge>
  );
}

export function BudgetStatusBadge({ status }: { status: BudgetStatus }) {
  const styles: Record<BudgetStatus, string> = {
    'Within Budget': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    'Near Limit': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    'Over Budget': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };
  return (
    <Badge variant="outline" className={cn('font-medium', styles[status])}>
      {status}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    FINANCE_MANAGER: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
    DEPARTMENT_MANAGER: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
    EMPLOYEE: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
  };
  return (
    <Badge variant="outline" className={cn('font-medium', styles[role] || styles.EMPLOYEE)}>
      {role.replace(/_/g, ' ')}
    </Badge>
  );
}
