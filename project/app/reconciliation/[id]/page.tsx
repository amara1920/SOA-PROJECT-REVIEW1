'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Scale, TrendingUp, TrendingDown } from 'lucide-react';
import { reconciliationApi } from '@/lib/api/reconciliation';
import { formatINR, formatPercent, formatDateTime } from '@/lib/format';
import type { ReconciliationRecord } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { BudgetStatusBadge } from '@/components/shared/status-badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function ReconciliationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [record, setRecord] = useState<ReconciliationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    reconciliationApi.get(id).then((r) => {
      if (r) setRecord(r);
      else setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <AppShell><LoadingState message="Loading reconciliation..." /></AppShell>;
  if (notFound) return (
    <AppShell>
      <EmptyState title="Record not found" message={`Reconciliation record ${id} does not exist.`} action={<Link href="/reconciliation"><Button>Back to Reconciliation</Button></Link>} />
    </AppShell>
  );
  if (!record) return <AppShell><ErrorState /></AppShell>;

  return (
    <AppShell>
      <Link href="/reconciliation" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Reconciliation
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{record.department}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{record.financialYear} • {record.budgetPeriod} • {record.id}</p>
        </div>
        <BudgetStatusBadge status={record.status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox label="Allocated Budget" value={formatINR(record.allocated)} icon={Scale} />
        <StatBox label="Actual Expenses" value={formatINR(record.actual)} icon={TrendingUp} />
        <StatBox label="Variance" value={formatINR(record.variance)} icon={TrendingUp} variant={record.variance < 0 ? 'danger' : 'success'} />
        <StatBox label="Utilization" value={formatPercent(record.utilization)} icon={TrendingDown} />
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-base">Utilization</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Budget Used</span>
            <span className={`text-sm font-bold ${record.utilization > 100 ? 'text-red-600' : record.utilization >= 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatPercent(record.utilization)}
            </span>
          </div>
          <Progress value={Math.min(record.utilization, 100)} className="h-3" />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle className="text-base">Calculation Details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <CalcRow label="Variance = Allocated Budget - Actual Expenses" value={formatINR(record.variance)} />
          <Separator />
          <CalcRow label="Utilization = (Actual Expenses / Allocated Budget) × 100" value={formatPercent(record.utilization)} />
          <Separator />
          <CalcRow label="Status" value={record.status} />
          <Separator />
          <CalcRow label="Last Reconciled" value={formatDateTime(record.lastReconciled)} />
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatBox({ label, value, icon: Icon, variant = 'default' }: {
  label: string; value: string; icon: React.ComponentType<{ className?: string }>; variant?: 'default' | 'success' | 'danger';
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

function CalcRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
