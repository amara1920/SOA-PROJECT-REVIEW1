'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check, X, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { expensesApi } from '@/lib/api/expenses';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatINR, formatDate } from '@/lib/format';
import type { Expense } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { ExpenseStatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

export default function ApprovalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pending, setPending] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rejectItem, setRejectItem] = useState<Expense | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await expensesApi.pendingApprovals();
      setPending(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (expense: Expense) => {
    setActionLoading(expense.id);
    try {
      await expensesApi.approve(expense.id, user?.name || 'Manager');
      setPending((prev) => prev.filter((e) => e.id !== expense.id));
      toast({ title: 'Expense approved', description: `${expense.id} has been approved.` });
    } catch {
      toast({ title: 'Error', description: 'Could not approve expense.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectItem || !rejectReason.trim()) return;
    setActionLoading(rejectItem.id);
    try {
      await expensesApi.reject(rejectItem.id, user?.name || 'Manager', rejectReason);
      setPending((prev) => prev.filter((e) => e.id !== rejectItem.id));
      toast({ title: 'Expense rejected', description: `${rejectItem.id} has been rejected.` });
      setRejectItem(null);
      setRejectReason('');
    } catch {
      toast({ title: 'Error', description: 'Could not reject expense.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Approvals"
        description={`${pending.length} expense${pending.length !== 1 ? 's' : ''} pending approval`}
        action={<Button variant="outline" onClick={load}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>}
      />

      {error ? (
        <ErrorState onRetry={load} />
      ) : loading ? (
        <LoadingState message="Loading pending approvals..." />
      ) : pending.length === 0 ? (
        <EmptyState icon={CheckCircle} title="No pending approvals" message="All expenses have been reviewed. Great work!" />
      ) : (
        <div className="space-y-3">
          {pending.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{e.id}</span>
                    <Badge variant="secondary" className="text-xs">{e.category}</Badge>
                    <ExpenseStatusBadge status={e.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Employee: {e.employeeName}</span>
                    <span>Dept: {e.department}</span>
                    <span>Date: {formatDate(e.expenseDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{formatINR(e.amount)}</span>
                  <Button size="sm" onClick={() => handleApprove(e)} disabled={actionLoading === e.id}>
                    {actionLoading === e.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />}
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setRejectItem(e)} disabled={actionLoading === e.id}>
                    <X className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!rejectItem} onOpenChange={(o) => !o && setRejectItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting {rejectItem?.id}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea id="reason" placeholder="Enter the reason for rejection..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim() || actionLoading !== null}>
              {actionLoading !== null ? 'Rejecting...' : 'Reject Expense'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
