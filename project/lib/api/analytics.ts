import { mockExpenses, mockBudgets } from '@/lib/mock-data';
import type {
  DashboardSummary,
  MonthlyTrend,
  DepartmentSpending,
  CategorySpending,
} from '@/types';

export const analyticsApi = {
  async summary(): Promise<DashboardSummary> {
    await new Promise((r) => setTimeout(r, 300));
    const fyBudgets = mockBudgets.filter((b) => b.financialYear === 'FY 2025-26');
    const totalBudget = fyBudgets.reduce((s, b) => s + b.allocated, 0);
    const totalExpenses = fyBudgets.reduce((s, b) => s + b.actual, 0);
    const remainingBudget = totalBudget - totalExpenses;
    const budgetUtilization = (totalExpenses / totalBudget) * 100;
    const pendingExpenses = mockExpenses.filter((e) => e.status === 'Pending').length;
    const overBudgetDepartments = fyBudgets.filter(
      (b) => b.actual / b.allocated > 1
    ).length;
    return {
      totalBudget,
      totalExpenses,
      remainingBudget,
      budgetUtilization,
      pendingExpenses,
      overBudgetDepartments,
    };
  },

  async monthly(): Promise<MonthlyTrend[]> {
    await new Promise((r) => setTimeout(r, 300));
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const expenseData = [320000, 410000, 380000, 525000, 490000, 600000];
    const budgetData = months.map(() => 775000);
    return months.map((m, i) => ({
      month: m,
      expenses: expenseData[i],
      budget: budgetData[i],
    }));
  },

  async departments(): Promise<DepartmentSpending[]> {
    await new Promise((r) => setTimeout(r, 300));
    return mockBudgets
      .filter((b) => b.financialYear === 'FY 2025-26')
      .map((b) => ({
        department: b.department.split(' ')[0],
        allocated: b.allocated,
        actual: b.actual,
        utilization: (b.actual / b.allocated) * 100,
      }));
  },

  async categories(): Promise<CategorySpending[]> {
    await new Promise((r) => setTimeout(r, 300));
    const categoryTotals: Record<string, number> = {};
    mockExpenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));
  },
};
