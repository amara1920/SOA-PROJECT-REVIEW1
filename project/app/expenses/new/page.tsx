'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/hooks/use-toast';
import { expensesApi } from '@/lib/api/expenses';
import { expenseSchema, type ExpenseFormValues } from '@/lib/validations';
import { DEPARTMENTS, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/lib/constants';
import type { Department, ExpenseCategory, PaymentMethod } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewExpensePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiptName, setReceiptName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      employeeName: user?.name || '',
      department: '',
      category: '',
      amount: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: '',
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    setLoading(true);
    try {
      const expense = await expensesApi.create({
        employeeName: data.employeeName,
        department: data.department as Department,
        category: data.category as ExpenseCategory,
        amount: data.amount,
        expenseDate: data.expenseDate,
        description: data.description,
        paymentMethod: data.paymentMethod as PaymentMethod,
        receiptName: receiptName || undefined,
      });
      toast({ title: 'Expense submitted successfully', description: `${expense.id} has been submitted for approval.` });
      router.push(`/expenses/${expense.id}`);
    } catch {
      toast({ title: 'Error', description: 'Could not submit expense. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Link href="/expenses" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Expenses
      </Link>
      <PageHeader title="New Expense" description="Submit a new expense for approval" />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input id="employeeName" {...register('employeeName')} />
                {errors.employeeName && <p className="text-xs text-red-500">{errors.employeeName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={(v) => { setDepartment(v); setValue('department', v, { shouldValidate: true }); }}>
                  <SelectTrigger id="department"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v); setValue('category', v, { shouldValidate: true }); }}>
                  <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (INR)</Label>
                <Input id="amount" type="number" step="1" placeholder="0" {...register('amount')} />
                {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expenseDate">Expense Date</Label>
                <Input id="expenseDate" type="date" {...register('expenseDate')} />
                {errors.expenseDate && <p className="text-xs text-red-500">{errors.expenseDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v); setValue('paymentMethod', v, { shouldValidate: true }); }}>
                  <SelectTrigger id="paymentMethod"><SelectValue placeholder="Select method" /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the expense purpose..." rows={3} {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt Upload</Label>
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent/10">
                  <Upload className="h-4 w-4" />
                  {receiptName || 'Choose file...'}
                  <input
                    id="receipt"
                    type="file"
                    className="hidden"
                    onChange={(e) => setReceiptName(e.target.files?.[0]?.name || '')}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Upload receipt in PDF or image format (mock upload)</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Expense'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/expenses')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
