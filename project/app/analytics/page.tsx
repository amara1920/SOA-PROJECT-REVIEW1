'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Scale } from 'lucide-react';
import { analyticsApi } from '@/lib/api/analytics';
import { formatINR, formatPercent } from '@/lib/format';
import { DEPARTMENTS, EXPENSE_CATEGORIES, FINANCIAL_YEARS } from '@/lib/constants';
import type {
  DashboardSummary, MonthlyTrend, DepartmentSpending, CategorySpending,
} from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, LoadingState, ErrorState } from '@/components/shared/states';
import { StatCard } from '@/components/shared/stat-card';
import { ChartCard } from '@/components/shared/chart-card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', '#6366f1'];

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyTrend[]>([]);
  const [departments, setDepartments] = useState<DepartmentSpending[]>([]);
  const [categories, setCategories] = useState<CategorySpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fy, setFy] = useState('FY 2025-26');
  const [dept, setDept] = useState('all');
  const [cat, setCat] = useState('all');

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
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, []);

  const varianceData = useMemo(() => departments.map((d) => ({
    department: d.department,
    variance: d.allocated - d.actual,
  })), [departments]);

  if (loading) return <AppShell><LoadingState message="Loading analytics..." /></AppShell>;
  if (error) return <AppShell><ErrorState /></AppShell>;
  if (!summary) return <AppShell><ErrorState /></AppShell>;

  return (
    <AppShell>
      <PageHeader title="Analytics" description="Financial insights and trends across the organization" />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Select value={fy} onValueChange={setFy}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Financial Year" /></SelectTrigger>
          <SelectContent>
            {FINANCIAL_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Budget" value={summary.totalBudget} type="currency" icon={Wallet} />
        <StatCard label="Total Expenses" value={summary.totalExpenses} type="currency" icon={TrendingUp} variant="warning" />
        <StatCard label="Variance" value={summary.totalBudget - summary.totalExpenses} type="currency" icon={Scale} variant="success" />
        <StatCard label="Utilization" value={summary.budgetUtilization} type="percent" icon={TrendingDown} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Expense Trend" description="Budget vs actual over time">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="aExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--chart-1))" fill="url(#aExp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Spending" description="Allocated vs actual by department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departments}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="allocated" name="Allocated" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Spending" description="Expense breakdown by category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categories} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={(e) => e.category} labelLine={false}>
                {categories.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Variance Analysis" description="Budget variance by department (positive = under budget)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={varianceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="variance" name="Variance" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </AppShell>
  );
}
