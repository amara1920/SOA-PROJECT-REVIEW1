'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, RefreshCw, Eye, Pencil, Trash2, Check, X, ArrowUpDown } from 'lucide-react';
import { expensesApi, type ExpenseFilters } from '@/lib/api/expenses';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatINR, formatDate } from '@/lib/format';
import { DEPARTMENTS, EXPENSE_CATEGORIES } from '@/lib/constants';
import type { Expense, ExpenseStatus, Department, ExpenseCategory } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, LoadingState, EmptyState, ErrorState } from '@/components/shared/states';
import { ExpenseStatusBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function ExpensesPage() {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState<string>('all');
  const [cat, setCat] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState('submittedDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = hasRole('ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_MANAGER');

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const filters: ExpenseFilters = {
        search,
        department: dept as Department | 'all',
        category: cat as ExpenseCategory | 'all',
        status: status as ExpenseStatus | 'all',
        sortBy,
        sortDir,
        page,
        pageSize,
      };
      const result = await expensesApi.list(filters);
      setExpenses(result.items);
      setTotal(result.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [search, dept, cat, status, sortBy, sortDir, page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await expensesApi.delete(deleteId);
      toast({ title: 'Expense deleted', description: `${deleteId} has been removed.` });
      setDeleteId(null);
      load();
    } catch {
      toast({ title: 'Error', description: 'Could not delete expense.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Expenses"
        description={user?.role === 'EMPLOYEE' ? 'Your submitted expenses' : 'All organizational expenses'}
        action={
          <Link href="/expenses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Expense
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, employee, or description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={dept} onValueChange={(v) => { setDept(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load} aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : loading ? (
        <LoadingState message="Loading expenses..." />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No expenses found"
          message="Try adjusting your filters or create a new expense."
          action={<Link href="/expenses/new"><Button><Plus className="mr-2 h-4 w-4" /> New Expense</Button></Link>}
        />
      ) : (
        <>
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    { key: 'id', label: 'Expense ID' },
                    { key: 'employeeName', label: 'Employee' },
                    { key: 'department', label: 'Department' },
                    { key: 'category', label: 'Category' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'expenseDate', label: 'Expense Date' },
                    { key: 'submittedDate', label: 'Submitted' },
                    { key: 'status', label: 'Status' },
                  ].map((col) => (
                    <TableHead key={col.key}>
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        {col.label}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">
                      <Link href={`/expenses/${e.id}`} className="text-primary hover:underline">{e.id}</Link>
                    </TableCell>
                    <TableCell>{e.employeeName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.department}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell className="font-medium">{formatINR(e.amount)}</TableCell>
                    <TableCell className="text-sm">{formatDate(e.expenseDate)}</TableCell>
                    <TableCell className="text-sm">{formatDate(e.submittedDate)}</TableCell>
                    <TableCell><ExpenseStatusBadge status={e.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.href = `/expenses/${e.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `/expenses/${e.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {canManage && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(e.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense?</DialogTitle>
            <DialogDescription>
              This will permanently remove expense {deleteId}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
