export type UserRole = 'ADMIN' | 'FINANCE_MANAGER' | 'DEPARTMENT_MANAGER' | 'EMPLOYEE';

export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected';

export type BudgetStatus = 'Within Budget' | 'Near Limit' | 'Over Budget';

export type Department =
  | 'Information Technology'
  | 'Finance'
  | 'Human Resources'
  | 'Marketing'
  | 'Operations'
  | 'Sales';

export type ExpenseCategory =
  | 'Travel'
  | 'Software'
  | 'Equipment'
  | 'Training'
  | 'Office Supplies'
  | 'Utilities'
  | 'Meals'
  | 'Other';

export type PaymentMethod =
  | 'Corporate Card'
  | 'Bank Transfer'
  | 'Cash'
  | 'Other';

export type BudgetPeriod = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Annual';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  avatar?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  submittedDate: string;
  status: ExpenseStatus;
  description: string;
  paymentMethod: PaymentMethod;
  receiptName?: string;
  approvedBy?: string;
  rejectionReason?: string;
  approvedDate?: string;
}

export interface Budget {
  id: string;
  department: Department;
  financialYear: string;
  budgetPeriod: BudgetPeriod;
  allocated: number;
  actual: number;
  notes: string;
  createdDate: string;
}

export interface ReconciliationRecord {
  id: string;
  department: Department;
  financialYear: string;
  budgetPeriod: BudgetPeriod;
  allocated: number;
  actual: number;
  variance: number;
  utilization: number;
  status: BudgetStatus;
  lastReconciled: string;
}

export type NotificationType =
  | 'expense'
  | 'approval'
  | 'budget'
  | 'reconciliation';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface DashboardSummary {
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
  budgetUtilization: number;
  pendingExpenses: number;
  overBudgetDepartments: number;
}

export interface MonthlyTrend {
  month: string;
  expenses: number;
  budget: number;
}

export interface DepartmentSpending {
  department: string;
  allocated: number;
  actual: number;
  utilization: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface ServiceInfo {
  name: string;
  purpose: string;
  responsibilities: string[];
  dataOwnership: string;
  endpoints: string[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
}
