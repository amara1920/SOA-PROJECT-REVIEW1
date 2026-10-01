'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Play, RefreshCw, Loader2, Scale } from 'lucide-react';
import { reconciliationApi } from '@/lib/api/reconciliation';
import { useToast } from '@/hooks/use-toast';
import { formatINR, formatPercent, formatDateTime } from '@/lib/format';
import type { ReconciliationRecord } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { BudgetStatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function ReconciliationPage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<ReconciliationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await reconciliationApi.list();
      setRecords(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRun = async () => {
    setRunning(true);
    try {
      const results = await reconciliationApi.run();
      setRecords(results);
      toast({ title: 'Reconciliation completed', description: `Reconciled ${results.length} departments at ${formatDateTime(new Date())}.` });
    } catch {
      toast({ title: 'Error', description: 'Could not run reconciliation.', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Reconciliation"
        description="Compare allocated budgets against actual expenses"
        action={
          <Button onClick={handleRun} disabled={running}>
            {running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...</> : <><Play className="mr-2 h-4 w-4" /> Run Reconciliation</>}
          </Button>
        }
      />

      {running && (
        <Card className="mb-4 border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium">Calculating variance and utilization...</p>
              <p className="text-xs text-muted-foreground">Comparing allocated budgets with actual expenses across all departments.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error ? (
        <ErrorState onRetry={load} />
      ) : loading ? (
        <LoadingState message="Loading reconciliation records..." />
      ) : records.length === 0 ? (
        <EmptyState icon={Scale} title="No reconciliation records" message="Run reconciliation to compare budgets against actual expenses." action={<Button onClick={handleRun}><Play className="mr-2 h-4 w-4" /> Run Reconciliation</Button>} />
      ) : (
        <>
          {records[0] && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Last Reconciled: {formatDateTime(records[0].lastReconciled)}</p>
              </CardContent>
            </Card>
          )}
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Financial Year</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      <Link href={`/reconciliation/${r.id}`} className="text-primary hover:underline">{r.department}</Link>
                    </TableCell>
                    <TableCell className="text-sm">{r.financialYear}</TableCell>
                    <TableCell className="font-medium">{formatINR(r.allocated)}</TableCell>
                    <TableCell>{formatINR(r.actual)}</TableCell>
                    <TableCell className={cn('font-medium', r.variance < 0 ? 'text-red-600' : 'text-emerald-600')}>{formatINR(r.variance)}</TableCell>
                    <TableCell className={cn('font-medium', r.utilization > 100 ? 'text-red-600' : r.utilization >= 80 ? 'text-amber-600' : 'text-emerald-600')}>{formatPercent(r.utilization)}</TableCell>
                    <TableCell><BudgetStatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </AppShell>
  );
}
