import { mockExpenses } from '@/lib/mock-data';
import type { Expense, ExpenseStatus, PaymentMethod, ExpenseCategory, Department } from '@/types';

let expenses = [...mockExpenses];

export interface ExpenseFilters {
  search?: string;
  department?: Department | 'all';
  category?: ExpenseCategory | 'all';
  status?: ExpenseStatus | 'all';
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const expensesApi = {
  async list(filters: ExpenseFilters = {}): Promise<{ items: Expense[]; total: number }> {
    await new Promise((r) => setTimeout(r, 300));
    let result = [...expenses];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.employeeName.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    if (filters.department && filters.department !== 'all') {
      result = result.filter((e) => e.department === filters.department);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter((e) => e.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((e) => e.status === filters.status);
    }

    const total = result.length;

    if (filters.sortBy) {
      const dir = filters.sortDir === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const av = a[filters.sortBy as keyof Expense];
        const bv = b[filters.sortBy as keyof Expense];
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const start = (page - 1) * pageSize;
    result = result.slice(start, start + pageSize);

    return { items: result, total };
  },

  async get(id: string): Promise<Expense | null> {
    await new Promise((r) => setTimeout(r, 200));
    return expenses.find((e) => e.id === id) || null;
  },

  async create(data: {
    employeeName: string;
    department: Department;
    category: ExpenseCategory;
    amount: number;
    expenseDate: string;
    description: string;
    paymentMethod: PaymentMethod;
    receiptName?: string;
  }): Promise<Expense> {
    await new Promise((r) => setTimeout(r, 600));
    const id = `EXP-${String(expenses.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString().split('T')[0];
    const newExpense: Expense = {
      id,
      employeeId: 'U004',
      ...data,
      submittedDate: now,
      status: 'Pending',
    };
    expenses = [newExpense, ...expenses];
    return newExpense;
  },

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    await new Promise((r) => setTimeout(r, 500));
    expenses = expenses.map((e) => (e.id === id ? { ...e, ...data } : e));
    return expenses.find((e) => e.id === id)!;
  },

  async delete(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 400));
    expenses = expenses.filter((e) => e.id !== id);
  },

  async approve(id: string, approvedBy: string): Promise<Expense> {
    await new Promise((r) => setTimeout(r, 400));
    const now = new Date().toISOString().split('T')[0];
    expenses = expenses.map((e) =>
      e.id === id ? { ...e, status: 'Approved', approvedBy, approvedDate: now } : e
    );
    return expenses.find((e) => e.id === id)!;
  },

  async reject(id: string, _approvedBy: string, reason: string): Promise<Expense> {
    await new Promise((r) => setTimeout(r, 400));
    const now = new Date().toISOString().split('T')[0];
    expenses = expenses.map((e) =>
      e.id === id ? { ...e, status: 'Rejected', approvedBy: _approvedBy, approvedDate: now, rejectionReason: reason } : e
    );
    return expenses.find((e) => e.id === id)!;
  },

  async pendingApprovals(): Promise<Expense[]> {
    await new Promise((r) => setTimeout(r, 300));
    return expenses.filter((e) => e.status === 'Pending');
  },
};
