import { mockBudgets } from '@/lib/mock-data';
import type { Budget, BudgetPeriod, Department } from '@/types';

let budgets = [...mockBudgets];

export const budgetsApi = {
  async list(): Promise<Budget[]> {
    await new Promise((r) => setTimeout(r, 300));
    return [...budgets];
  },

  async get(id: string): Promise<Budget | null> {
    await new Promise((r) => setTimeout(r, 200));
    return budgets.find((b) => b.id === id) || null;
  },

  async create(data: {
    department: Department;
    financialYear: string;
    budgetPeriod: BudgetPeriod;
    allocated: number;
    notes: string;
  }): Promise<Budget> {
    await new Promise((r) => setTimeout(r, 600));
    const id = `BUD-${String(budgets.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().split('T')[0];
    const newBudget: Budget = {
      id,
      ...data,
      actual: 0,
      createdDate: now,
    };
    budgets = [newBudget, ...budgets];
    return newBudget;
  },

  async update(id: string, data: Partial<Budget>): Promise<Budget> {
    await new Promise((r) => setTimeout(r, 500));
    budgets = budgets.map((b) => (b.id === id ? { ...b, ...data } : b));
    return budgets.find((b) => b.id === id)!;
  },
};
