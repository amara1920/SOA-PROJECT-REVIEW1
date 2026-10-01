'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, RefreshCw, Wallet } from 'lucide-react';
import { budgetsApi } from '@/lib/api/budgets';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatINR, formatPercent, formatDate } from '@/lib/format';
import type { Budget } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { BudgetStatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

function getBudgetStatus(b: Budget): 'Within Budget' | 'Near Limit' | 'Over Budget' {
  const util = (b.actual / b.allocated) * 100;
  if (util > 100) return 'Over Budget';
  if (util >= 80) return 'Near Limit';
  return 'Within Budget';
}

export default function BudgetsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [fy, setFy] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await budgetsApi.list();
      setBudgets(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = budgets.filter((b) => {
    if (search) {
      const q = search.toLowerCase();
      if (!b.department.toLowerCase().includes(q) && !b.id.toLowerCase().includes(q)) return false;
    }
    if (fy !== 'all' && b.financialYear !== fy) return false;
    return true;
  });

  return (
    <AppShell>
      <PageHeader
        title="Budgets"
        description="Department-wise budget allocation and utilization"
        action={
          <Link href="/budgets/new">
            <Button><Plus className="mr-2 h-4 w-4" /> New Budget</Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by department or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={fy} onValueChange={setFy}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Financial Year" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="FY 2025-26">FY 2025-26</SelectItem>
            <SelectItem value="FY 2024-25">FY 2024-25</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : loading ? (
        <LoadingState message="Loading budgets..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Wallet} title="No budgets found" message="Try adjusting your filters or create a new budget." action={<Link href="/budgets/new"><Button><Plus className="mr-2 h-4 w-4" /> New Budget</Button></Link>} />
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Financial Year</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead className="min-w-32">Utilization</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => {
                const remaining = b.allocated - b.actual;
                const util = (b.actual / b.allocated) * 100;
                const status = getBudgetStatus(b);
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">
                      <Link href={`/budgets/${b.id}`} className="text-primary hover:underline">{b.department}</Link>
                    </TableCell>
                    <TableCell className="text-sm">{b.financialYear}</TableCell>
                    <TableCell className="text-sm">{b.budgetPeriod}</TableCell>
                    <TableCell className="font-medium">{formatINR(b.allocated)}</TableCell>
                    <TableCell>{formatINR(b.actual)}</TableCell>
                    <TableCell className={cn(remaining < 0 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium')}>{formatINR(remaining)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(util, 100)} className="h-2 flex-1" />
                        <span className="text-xs font-medium w-12 text-right">{formatPercent(util)}</span>
                      </div>
                    </TableCell>
                    <TableCell><BudgetStatusBadge status={status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </AppShell>
  );
}
