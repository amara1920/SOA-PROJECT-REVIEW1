'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Clock, AlertTriangle, Receipt } from 'lucide-react';
import { analyticsApi } from '@/lib/api/analytics';
import { formatINR, formatPercent } from '@/lib/format';
import type {
  DashboardSummary,
  MonthlyTrend,
  DepartmentSpending,
  CategorySpending,
} from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { StatCard } from '@/components/shared/stat-card';
import { ChartCard } from '@/components/shared/chart-card';
import { LoadingState } from '@/components/shared/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', '#6366f1'];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyTrend[]>([]);
  const [departments, setDepartments] = useState<DepartmentSpending[]>([]);
  const [categories, setCategories] = useState<CategorySpending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.summary(),
      analyticsApi.monthly(),
      analyticsApi.departments(),
      analyticsApi.categories(),
    ]).then(([s, m, d, c]) => {
      setSummary(s);
      setMonthly(m);
      setDepartments(d);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <AppShell>
        <LoadingState message="Loading dashboard..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organization-wide financial overview for FY 2025-26
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Budget" value={summary.totalBudget} type="currency" icon={Wallet} variant="default" />
        <StatCard label="Total Expenses" value={summary.totalExpenses} type="currency" icon={Receipt} variant="warning" />
        <StatCard label="Remaining Budget" value={summary.remainingBudget} type="currency" icon={TrendingUp} variant="success" />
        <StatCard label="Budget Utilization" value={summary.budgetUtilization} type="percent" icon={TrendingUp} />
        <StatCard label="Pending Expenses" value={summary.pendingExpenses} type="number" icon={Clock} variant="warning" />
        <StatCard label="Over-Budget Depts" value={summary.overBudgetDepartments} type="number" icon={AlertTriangle} variant="danger" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Expense Trend" description="Budget vs actual expenses over time">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip
                formatter={(v: number) => formatINR(v)}
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
              />
              <Legend />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--chart-2))" fill="url(#colorBudget)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--chart-1))" fill="url(#colorExpenses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department-wise Expenses" description="Allocated vs actual by department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departments}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="department" className="text-xs" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="allocated" name="Allocated" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Category Distribution" description="Spending breakdown by category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(e) => e.category}
                labelLine={false}
              >
                {categories.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Budget Utilization by Department" description="Percentage of budget used">
          <div className="space-y-4 pt-2">
            {departments.map((d, i) => (
              <div key={d.department}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{d.department}</span>
                  <span className={d.utilization > 100 ? 'text-red-500 font-medium' : d.utilization >= 80 ? 'text-amber-500 font-medium' : 'text-emerald-500 font-medium'}>
                    {formatPercent(d.utilization)}
                  </span>
                </div>
                <Progress
                  value={Math.min(d.utilization, 100)}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Summary card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Total Allocated Budget</div>
              <div className="mt-1 text-xl font-bold">{formatINR(summary.totalBudget)}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Total Actual Expenses</div>
              <div className="mt-1 text-xl font-bold">{formatINR(summary.totalExpenses)}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Variance (Allocated - Actual)</div>
              <div className="mt-1 text-xl font-bold text-emerald-600">{formatINR(summary.totalBudget - summary.totalExpenses)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
