'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { budgetsApi } from '@/lib/api/budgets';
import { mockExpenses } from '@/lib/mock-data';
import { formatINR, formatPercent, formatDate } from '@/lib/format';
import type { Budget } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { BudgetStatusBadge } from '@/components/shared/status-badges';
import { ChartCard } from '@/components/shared/chart-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { ExpenseStatusBadge } from '@/components/shared/status-badges';

function getBudgetStatus(b: Budget): 'Within Budget' | 'Near Limit' | 'Over Budget' {
  const util = (b.actual / b.allocated) * 100;
  if (util > 100) return 'Over Budget';
  if (util >= 80) return 'Near Limit';
  return 'Within Budget';
}

export default function BudgetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    budgetsApi.get(id).then((b) => {
      if (b) setBudget(b);
      else setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  const monthlyData = useMemo(() => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const base = (budget?.actual || 0) / 6;
    return months.map((m) => ({
      month: m,
      spending: Math.round(base * (0.7 + Math.random() * 0.6)),
    }));
  }, [budget]);

  const categoryBreakdown = useMemo(() => {
    const cats = ['Travel', 'Software', 'Equipment', 'Training', 'Office Supplies'];
    const total = budget?.actual || 1;
    return cats.map((c, i) => ({
      category: c,
      amount: Math.round(total * [0.25, 0.3, 0.15, 0.1, 0.2][i]),
    }));
  }, [budget]);

  const recentExpenses = useMemo(() => {
    if (!budget) return [];
    return mockExpenses
      .filter((e) => e.department === budget.department)
      .slice(0, 5);
  }, [budget]);

  if (loading) return <AppShell><LoadingState message="Loading budget..." /></AppShell>;
  if (notFound) return (
    <AppShell>
      <EmptyState title="Budget not found" message={`Budget ${id} does not exist.`} action={<Link href="/budgets"><Button>Back to Budgets</Button></Link>} />
    </AppShell>
  );
  if (!budget) return <AppShell><ErrorState /></AppShell>;

  const remaining = budget.allocated - budget.actual;
  const variance = budget.allocated - budget.actual;
  const utilization = (budget.actual / budget.allocated) * 100;
  const status = getBudgetStatus(budget);

  return (
    <AppShell>
      <Link href="/budgets" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Budgets
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{budget.department}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{budget.financialYear} • {budget.budgetPeriod} • {budget.id}</p>
        </div>
        <BudgetStatusBadge status={status} />
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox label="Allocated" value={formatINR(budget.allocated)} icon={Wallet} />
        <StatBox label="Actual" value={formatINR(budget.actual)} icon={TrendingUp} />
        <StatBox label="Remaining" value={formatINR(remaining)} icon={TrendingDown} variant={remaining < 0 ? 'danger' : 'success'} />
        <StatBox label="Variance" value={formatINR(variance)} icon={TrendingUp} variant={variance < 0 ? 'danger' : 'success'} />
      </div>

      {/* Utilization bar */}
      <Card className="mt-4">
        <CardContent className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Budget Utilization</span>
            <span className={`text-sm font-bold ${utilization > 100 ? 'text-red-600' : utilization >= 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatPercent(utilization)}
            </span>
          </div>
          <Progress value={Math.min(utilization, 100)} className="h-3" />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Spending" description="Spending trend across the financial year">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v, true)} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
              <Area type="monotone" dataKey="spending" name="Spending" stroke="hsl(var(--chart-1))" fill="url(#colorSpend)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Breakdown" description="Spending by expense category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => formatINR(v, true)} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="amount" name="Amount" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent expenses */}
      <Card className="mt-4">
        <CardHeader><CardTitle className="text-base">Recent Expenses</CardTitle></CardHeader>
        <CardContent>
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No recent expenses for this department.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">
                      <Link href={`/expenses/${e.id}`} className="text-primary hover:underline">{e.id}</Link>
                    </TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell className="font-medium">{formatINR(e.amount)}</TableCell>
                    <TableCell className="text-sm">{formatDate(e.expenseDate)}</TableCell>
                    <TableCell><ExpenseStatusBadge status={e.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatBox({ label, value, icon: Icon, variant = 'default' }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'success' | 'danger';
}) {
  const colors = {
    default: 'text-primary bg-primary/5',
    success: 'text-emerald-600 bg-emerald-500/5',
    danger: 'text-red-600 bg-red-500/5',
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[variant]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
