'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X, Pencil, Trash2, Loader2 } from 'lucide-react';
import { expensesApi } from '@/lib/api/expenses';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatINR, formatDate } from '@/lib/format';
import type { Expense } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { ExpenseStatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const id = params.id as string;
  const canApprove = hasRole('ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER');

  useEffect(() => {
    expensesApi.get(id).then((e) => {
      if (e) setExpense(e);
      else setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  const handleApprove = async () => {
    if (!expense) return;
    setActionLoading(true);
    try {
      const updated = await expensesApi.approve(expense.id, user?.name || 'Manager');
      setExpense(updated);
      toast({ title: 'Expense approved', description: `${expense.id} has been approved.` });
    } catch {
      toast({ title: 'Error', description: 'Could not approve expense.', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!expense || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const updated = await expensesApi.reject(expense.id, user?.name || 'Manager', rejectReason);
      setExpense(updated);
      toast({ title: 'Expense rejected', description: `${expense.id} has been rejected.` });
      setRejectOpen(false);
      setRejectReason('');
    } catch {
      toast({ title: 'Error', description: 'Could not reject expense.', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!expense) return;
    setActionLoading(true);
    try {
      await expensesApi.delete(expense.id);
      toast({ title: 'Expense deleted', description: `${expense.id} has been removed.` });
      router.push('/expenses');
    } catch {
      toast({ title: 'Error', description: 'Could not delete expense.', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <AppShell><LoadingState message="Loading expense..." /></AppShell>;
  if (notFound) return (
    <AppShell>
      <EmptyState title="Expense not found" message={`Expense ${id} does not exist.`} action={<Link href="/expenses"><Button>Back to Expenses</Button></Link>} />
    </AppShell>
  );
  if (!expense) return <AppShell><ErrorState /></AppShell>;

  return (
    <AppShell>
      <Link href="/expenses" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Expenses
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{expense.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{expense.description}</p>
        </div>
        <ExpenseStatusBadge status={expense.status} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Expense Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Employee" value={expense.employeeName} />
              <InfoRow label="Department" value={expense.department} />
              <InfoRow label="Category" value={expense.category} />
              <InfoRow label="Amount" value={formatINR(expense.amount)} highlight />
              <InfoRow label="Expense Date" value={formatDate(expense.expenseDate)} />
              <InfoRow label="Submitted Date" value={formatDate(expense.submittedDate)} />
              <InfoRow label="Payment Method" value={expense.paymentMethod} />
              <InfoRow label="Receipt" value={expense.receiptName || 'No receipt uploaded'} />
            </div>
            <Separator />
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">Description</div>
              <p className="text-sm">{expense.description}</p>
            </div>
            {expense.approvedBy && (
              <>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow label="Approved By" value={expense.approvedBy} />
                  <InfoRow label="Approved Date" value={expense.approvedDate ? formatDate(expense.approvedDate) : '-'} />
                </div>
              </>
            )}
            {expense.rejectionReason && (
              <>
                <Separator />
                <div>
                  <div className="text-xs font-medium text-red-500 mb-1">Rejection Reason</div>
                  <p className="text-sm text-red-600 dark:text-red-400">{expense.rejectionReason}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {canApprove && expense.status === 'Pending' && (
            <Card>
              <CardHeader><CardTitle className="text-base">Approval Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleApprove} disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Approve
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => setRejectOpen(true)} disabled={actionLoading}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => router.push('/expenses')}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Expense
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete Expense
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting {expense.id}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim() || actionLoading}>
              {actionLoading ? 'Rejecting...' : 'Reject Expense'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm ${highlight ? 'font-bold text-lg' : ''}`}>{value}</div>
    </div>
  );
}
