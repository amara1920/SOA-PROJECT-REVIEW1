'use client';

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertTriangle, CheckCircle, Target, Users, Workflow, Database } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/states';

const functionalRequirements = [
  'FR-01: User registration and login',
  'FR-02: Role-based access',
  'FR-03: Expense creation',
  'FR-04: Expense submission',
  'FR-05: Expense approval/rejection',
  'FR-06: Budget creation and monitoring',
  'FR-07: Department-wise budget tracking',
  'FR-08: Budget versus actual expense comparison',
  'FR-09: Variance calculation',
  'FR-10: Budget utilization calculation',
  'FR-11: Financial reconciliation',
  'FR-12: Financial analytics',
  'FR-13: Notifications',
  'FR-14: User management for administrators',
  'FR-15: Dashboard and reporting',
];

const nonFunctionalRequirements = [
  'Security', 'Scalability', 'Maintainability', 'Availability', 'Performance',
  'Responsive design', 'Accessibility', 'Role-based authorization', 'Service-oriented architecture',
];

const userRoles = [
  { role: 'ADMIN', responsibilities: ['Manage users', 'View organization-wide financial information', 'Manage system configuration', 'Access architecture information'] },
  { role: 'FINANCE_MANAGER', responsibilities: ['View organization-wide financial data', 'Manage budgets', 'Review expenses', 'Perform reconciliation', 'View analytics'] },
  { role: 'DEPARTMENT_MANAGER', responsibilities: ['View department expenses', 'Review department expenses', 'Approve/reject expenses', 'Monitor department budgets', 'Perform reconciliation'] },
  { role: 'EMPLOYEE', responsibilities: ['View personal expenses', 'Submit expenses', 'View expense status', 'View notifications'] },
];

const workflowSteps = [
  'Employee', 'Submit Expense', 'Manager Approval', 'Approved Expense',
  'Actual Spending', 'Budget Comparison', 'Variance Calculation',
  'Reconciliation', 'Analytics',
];

export default function RequirementsPage() {
  return (
    <AppShell>
      <PageHeader title="Problem Analysis & Requirement Specification" description="Business problem, solution, and system requirements for FinSight" />

      {/* A. Problem Statement */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> A. Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Corporate organizations have multiple departments, each receiving an allocated financial budget.
            Employees incur expenses, managers approve or reject them, and finance teams need to compare
            allocated budgets against actual spending. The organization needs to identify spending, budget
            utilization, remaining budget, variance, over-budget departments, pending approvals, reconciliation
            status, and financial trends — all in a centralized system.
          </p>
        </CardContent>
      </Card>

      {/* B. Existing Problems */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> B. Existing Problems</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              'No centralized expense tracking across departments',
              'Manual budget comparison prone to errors',
              'No real-time visibility into budget utilization',
              'Delayed approval workflows',
              'No automated variance calculation',
              'Fragmented financial reporting',
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-red-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* C. Proposed Solution */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-500" /> C. Proposed Solution</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            FinSight provides a centralized system for expense tracking, budget management, expense approval,
            budget monitoring, reconciliation, financial analytics, role-based access, and secure authentication.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {['Expense tracking', 'Budget management', 'Expense approval', 'Budget monitoring', 'Reconciliation', 'Financial analytics', 'Role-based access', 'Secure authentication'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {f}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* D. Functional Requirements */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> D. Functional Requirements</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {functionalRequirements.map((fr) => (
              <div key={fr} className="flex items-center gap-2 text-sm rounded-lg border p-2">
                <Badge variant="secondary" className="text-xs shrink-0">{fr.split(':')[0]}</Badge>
                <span className="text-muted-foreground">{fr.split(':')[1]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* E. Non-Functional Requirements */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> E. Non-Functional Requirements</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {nonFunctionalRequirements.map((nfr) => <Badge key={nfr} variant="outline" className="text-sm">{nfr}</Badge>)}
          </div>
        </CardContent>
      </Card>

      {/* F. User Roles */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> F. User Roles</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {userRoles.map((r) => (
              <div key={r.role} className="rounded-lg border p-4">
                <Badge className="mb-2">{r.role.replace(/_/g, ' ')}</Badge>
                <ul className="space-y-1">
                  {r.responsibilities.map((resp) => (
                    <li key={resp} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* G. Business Workflow */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Workflow className="h-5 w-5 text-primary" /> G. Business Workflow</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {workflowSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="rounded-lg border bg-primary/5 px-3 py-2 text-xs font-medium">{step}</div>
                {i < workflowSteps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* H. Key Business Calculations */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">H. Key Business Calculations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-sm font-semibold">Variance</div>
            <div className="mt-1 font-mono text-sm">Variance = Allocated Budget - Actual Expenses</div>
            <div className="mt-1 text-xs text-muted-foreground">Example: ₹12,00,000 - ₹9,85,000 = ₹2,15,000</div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-sm font-semibold">Budget Utilization</div>
            <div className="mt-1 font-mono text-sm">Budget Utilization = (Actual Expenses / Allocated Budget) × 100</div>
            <div className="mt-1 text-xs text-muted-foreground">Example: (₹9,85,000 / ₹12,00,000) × 100 = 82.1%</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 p-3 text-center">
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Below 80%</div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">WITHIN BUDGET</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-3 text-center">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">80% - 100%</div>
              <div className="text-sm font-bold text-amber-700 dark:text-amber-400">NEAR LIMIT</div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-3 text-center">
              <div className="text-xs font-semibold text-red-700 dark:text-red-400">Above 100%</div>
              <div className="text-sm font-bold text-red-700 dark:text-red-400">OVER BUDGET</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* I. System Scope & Future Architecture */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> I. System Scope & Future Backend Architecture</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-semibold mb-2 text-primary">Current (Frontend)</div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>Next.js frontend with mock data</li>
                <li>Mock API service layer</li>
                <li>Mock JWT-ready authentication</li>
                <li>Centralized state management</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-semibold mb-2 text-primary">Future (Backend)</div>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>Java Spring Boot</li>
                <li>Spring Security + JWT</li>
                <li>Spring Cloud API Gateway</li>
                <li>Eureka Service Discovery</li>
                <li>MySQL / PostgreSQL</li>
                <li>5 microservices with own databases</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
