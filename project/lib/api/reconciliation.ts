import { mockReconciliation, mockBudgets } from '@/lib/mock-data';
import type { ReconciliationRecord } from '@/types';

let records = [...mockReconciliation];

export const reconciliationApi = {
  async list(): Promise<ReconciliationRecord[]> {
    await new Promise((r) => setTimeout(r, 300));
    return [...records];
  },

  async get(id: string): Promise<ReconciliationRecord | null> {
    await new Promise((r) => setTimeout(r, 200));
    return records.find((r) => r.id === id) || null;
  },

  async run(): Promise<ReconciliationRecord[]> {
    await new Promise((r) => setTimeout(r, 1200));
    const now = new Date().toISOString();
    records = mockBudgets
      .filter((b) => b.financialYear === 'FY 2025-26')
      .map((b, i) => {
        const variance = b.allocated - b.actual;
        const utilization = (b.actual / b.allocated) * 100;
        const status =
          utilization > 100 ? 'Over Budget' : utilization >= 80 ? 'Near Limit' : 'Within Budget';
        return {
          id: `REC-${String(i + 1).padStart(3, '0')}`,
          department: b.department,
          financialYear: b.financialYear,
          budgetPeriod: b.budgetPeriod,
          allocated: b.allocated,
          actual: b.actual,
          variance,
          utilization,
          status,
          lastReconciled: now,
        };
      });
    return [...records];
  },
};
