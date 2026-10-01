import type {
  User,
  Expense,
  Budget,
  ReconciliationRecord,
  AppNotification,
  Department,
  ExpenseCategory,
  PaymentMethod,
} from '@/types';

export const mockUsers: User[] = [
  { id: 'U001', name: 'Arjun Mehta', email: 'admin@finsight.demo', role: 'ADMIN', department: 'Information Technology', status: 'Active', joinedDate: '2023-01-15' },
  { id: 'U002', name: 'Priya Sharma', email: 'finance@finsight.demo', role: 'FINANCE_MANAGER', department: 'Finance', status: 'Active', joinedDate: '2023-02-20' },
  { id: 'U003', name: 'Rohan Verma', email: 'manager@finsight.demo', role: 'DEPARTMENT_MANAGER', department: 'Information Technology', status: 'Active', joinedDate: '2023-03-10' },
  { id: 'U004', name: 'Ananya Reddy', email: 'employee@finsight.demo', role: 'EMPLOYEE', department: 'Information Technology', status: 'Active', joinedDate: '2023-06-01' },
  { id: 'U005', name: 'Karthik Nair', email: 'karthik.nair@finsight.demo', role: 'DEPARTMENT_MANAGER', department: 'Finance', status: 'Active', joinedDate: '2023-02-25' },
  { id: 'U006', name: 'Sneha Iyer', email: 'sneha.iyer@finsight.demo', role: 'DEPARTMENT_MANAGER', department: 'Marketing', status: 'Active', joinedDate: '2023-04-18' },
  { id: 'U007', name: 'Vikram Singh', email: 'vikram.singh@finsight.demo', role: 'EMPLOYEE', department: 'Marketing', status: 'Active', joinedDate: '2023-07-12' },
  { id: 'U008', name: 'Deepika Joshi', email: 'deepika.joshi@finsight.demo', role: 'EMPLOYEE', department: 'Finance', status: 'Active', joinedDate: '2023-05-08' },
  { id: 'U009', name: 'Suresh Pillai', email: 'suresh.pillai@finsight.demo', role: 'EMPLOYEE', department: 'Sales', status: 'Active', joinedDate: '2023-08-03' },
  { id: 'U010', name: 'Meera Krishnan', email: 'meera.krishnan@finsight.demo', role: 'DEPARTMENT_MANAGER', department: 'Operations', status: 'Active', joinedDate: '2023-01-28' },
  { id: 'U011', name: 'Aditya Gupta', email: 'aditya.gupta@finsight.demo', role: 'EMPLOYEE', department: 'Operations', status: 'Active', joinedDate: '2023-09-15' },
  { id: 'U012', name: 'Lakshmi Rao', email: 'lakshmi.rao@finsight.demo', role: 'EMPLOYEE', department: 'Human Resources', status: 'Inactive', joinedDate: '2023-03-22' },
];

const departments: Department[] = ['Information Technology', 'Finance', 'Human Resources', 'Marketing', 'Operations', 'Sales'];
const categories: ExpenseCategory[] = ['Travel', 'Software', 'Equipment', 'Training', 'Office Supplies', 'Utilities', 'Meals', 'Other'];
const paymentMethods: PaymentMethod[] = ['Corporate Card', 'Bank Transfer', 'Cash', 'Other'];
const names = mockUsers.filter((u) => u.role === 'EMPLOYEE' || u.role === 'DEPARTMENT_MANAGER');

function generateExpenses(): Expense[] {
  const expenses: Expense[] = [];
  const statuses: Expense['status'][] = ['Pending', 'Approved', 'Rejected'];
  for (let i = 1; i <= 36; i++) {
    const user = names[i % names.length];
    const dept = user.department;
    const cat = categories[i % categories.length];
    const status = i <= 18 ? 'Pending' : statuses[i % 3];
    const amount = [4200, 15500, 8800, 3200, 67500, 12500, 4500, 9800, 23000, 5600, 18700, 3400][i % 12];
    const day = (i % 28) + 1;
    const month = ((i % 12) + 1).toString().padStart(2, '0');
    expenses.push({
      id: `EXP-${String(i).padStart(4, '0')}`,
      employeeId: user.id,
      employeeName: user.name,
      department: dept,
      category: cat,
      amount,
      expenseDate: `2025-${month}-${day.toString().padStart(2, '0')}`,
      submittedDate: `2025-${month}-${(day + 1).toString().padStart(2, '0')}`,
      status,
      description: `${cat} expense for ${dept} department operations`,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      receiptName: i % 3 === 0 ? `receipt-${i}.pdf` : undefined,
      approvedBy: status !== 'Pending' ? 'Rohan Verma' : undefined,
      approvedDate: status !== 'Pending' ? `2025-${month}-${(day + 3).toString().padStart(2, '0')}` : undefined,
      rejectionReason: status === 'Rejected' ? 'Receipt missing or amount exceeds department limit' : undefined,
    });
  }
  return expenses;
}

export const mockExpenses: Expense[] = generateExpenses();

export const mockBudgets: Budget[] = [
  { id: 'BUD-001', department: 'Information Technology', financialYear: 'FY 2025-26', budgetPeriod: 'Annual', allocated: 1200000, actual: 985000, notes: 'IT infrastructure and software licenses', createdDate: '2025-04-01' },
  { id: 'BUD-002', department: 'Finance', financialYear: 'FY 2025-26', budgetPeriod: 'Annual', allocated: 800000, actual: 765000, notes: 'Finance operations and compliance', createdDate: '2025-04-01' },
  { id: 'BUD-003', department: 'Human Resources', financialYear: 'FY 2025-26', budgetPeriod: 'Annual', allocated: 500000, actual: 432000, notes: 'HR recruitment and training', createdDate: '2025-04-01' },
  { id: 'BUD-004', department: 'Marketing', financialYear: 'FY 2025-26', budgetPeriod: 'Annual', allocated: 900000, actual: 945000, notes: 'Marketing campaigns and branding', createdDate: '2025-04-01' },
  { id: 'BUD-005', department: 'Operations', financialYear: 'FY 2025-26', budgetPeriod: 'Annual', allocated: 700000, actual: 588000, notes: 'Operations and logistics', createdDate: '2025-04-01' },
  { id: 'BUD-006', department: 'Sales', financialYear: 'FY 2025-26', budgetPeriod: 'Annual', allocated: 650000, actual: 712000, notes: 'Sales travel and client engagement', createdDate: '2025-04-01' },
  { id: 'BUD-007', department: 'Information Technology', financialYear: 'FY 2024-25', budgetPeriod: 'Annual', allocated: 1000000, actual: 920000, notes: 'Previous year IT budget', createdDate: '2024-04-01' },
  { id: 'BUD-008', department: 'Finance', financialYear: 'FY 2024-25', budgetPeriod: 'Annual', allocated: 750000, actual: 680000, notes: 'Previous year Finance budget', createdDate: '2024-04-01' },
  { id: 'BUD-009', department: 'Marketing', financialYear: 'FY 2024-25', budgetPeriod: 'Q1', allocated: 250000, actual: 198000, notes: 'Q1 marketing campaigns', createdDate: '2024-04-01' },
  { id: 'BUD-010', department: 'Operations', financialYear: 'FY 2024-25', budgetPeriod: 'Q2', allocated: 200000, actual: 187000, notes: 'Q2 operations', createdDate: '2024-07-01' },
];

export const mockReconciliation: ReconciliationRecord[] = mockBudgets
  .filter((b) => b.financialYear === 'FY 2025-26')
  .map((b, i) => {
    const variance = b.allocated - b.actual;
    const utilization = (b.actual / b.allocated) * 100;
    const status = utilization > 100 ? 'Over Budget' : utilization >= 80 ? 'Near Limit' : 'Within Budget';
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
      lastReconciled: '2025-09-15T10:30:00',
    };
  });

export const mockNotifications: AppNotification[] = [
  { id: 'N001', type: 'approval', title: 'Expense Pending Approval', message: 'EXP-0001 by Ananya Reddy requires your approval', read: false, createdAt: '2025-09-19T08:30:00', link: '/approvals' },
  { id: 'N002', type: 'budget', title: 'Budget Alert: Marketing', message: 'Marketing department has exceeded 80% budget utilization', read: false, createdAt: '2025-09-19T07:15:00', link: '/budgets' },
  { id: 'N003', type: 'expense', title: 'Expense Approved', message: 'Your expense EXP-0025 has been approved', read: false, createdAt: '2025-09-18T16:45:00', link: '/expenses' },
  { id: 'N004', type: 'reconciliation', title: 'Reconciliation Completed', message: 'Q2 reconciliation has been completed for all departments', read: true, createdAt: '2025-09-17T14:20:00', link: '/reconciliation' },
  { id: 'N005', type: 'budget', title: 'Over-Budget Alert: Sales', message: 'Sales department is over budget by ₹62,000', read: false, createdAt: '2025-09-16T11:00:00', link: '/budgets' },
  { id: 'N006', type: 'expense', title: 'Expense Rejected', message: 'Your expense EXP-0030 was rejected. Reason: Receipt missing', read: true, createdAt: '2025-09-15T13:30:00', link: '/expenses' },
  { id: 'N007', type: 'approval', title: '3 New Pending Approvals', message: 'You have 3 expenses pending approval', read: true, createdAt: '2025-09-14T09:00:00', link: '/approvals' },
  { id: 'N008', type: 'reconciliation', title: 'Reconciliation Due', message: 'Monthly reconciliation is due for Operations department', read: false, createdAt: '2025-09-13T17:00:00', link: '/reconciliation' },
  { id: 'N009', type: 'budget', title: 'Budget Allocated', message: 'FY 2025-26 budgets have been allocated for all departments', read: true, createdAt: '2025-09-01T10:00:00', link: '/budgets' },
  { id: 'N010', type: 'expense', title: 'Expense Submitted', message: 'Your expense EXP-0035 has been submitted for approval', read: true, createdAt: '2025-09-12T15:45:00', link: '/expenses' },
];

export const demoAccounts = [
  { role: 'ADMIN', email: 'admin@finsight.demo', password: 'Admin@123', name: 'Arjun Mehta', department: 'Information Technology' },
  { role: 'FINANCE_MANAGER', email: 'finance@finsight.demo', password: 'Finance@123', name: 'Priya Sharma', department: 'Finance' },
  { role: 'DEPARTMENT_MANAGER', email: 'manager@finsight.demo', password: 'Manager@123', name: 'Rohan Verma', department: 'Information Technology' },
  { role: 'EMPLOYEE', email: 'employee@finsight.demo', password: 'Employee@123', name: 'Ananya Reddy', department: 'Information Technology' },
];
