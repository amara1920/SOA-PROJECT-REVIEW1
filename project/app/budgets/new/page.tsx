'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { budgetsApi } from '@/lib/api/budgets';
import { budgetSchema, type BudgetFormValues } from '@/lib/validations';
import { DEPARTMENTS, FINANCIAL_YEARS, BUDGET_PERIODS } from '@/lib/constants';
import type { Department, BudgetPeriod } from '@/types';
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

export default function NewBudgetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState('');
  const [financialYear, setFinancialYear] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { department: '', financialYear: '', budgetPeriod: '', allocated: 0, notes: '' },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    setLoading(true);
    try {
      const budget = await budgetsApi.create({
        department: data.department as Department,
        financialYear: data.financialYear,
        budgetPeriod: data.budgetPeriod as BudgetPeriod,
        allocated: data.allocated,
        notes: data.notes || '',
      });
      toast({ title: 'Budget created successfully', description: `${budget.id} for ${budget.department} has been created.` });
      router.push(`/budgets/${budget.id}`);
    } catch {
      toast({ title: 'Error', description: 'Could not create budget.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Link href="/budgets" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Budgets
      </Link>
      <PageHeader title="New Budget" description="Allocate a budget for a department" />

      <Card className="max-w-2xl">
        <CardHeader><CardTitle className="text-base">Budget Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label htmlFor="financialYear">Financial Year</Label>
                <Select value={financialYear} onValueChange={(v) => { setFinancialYear(v); setValue('financialYear', v, { shouldValidate: true }); }}>
                  <SelectTrigger id="financialYear"><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    {FINANCIAL_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.financialYear && <p className="text-xs text-red-500">{errors.financialYear.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budgetPeriod">Budget Period</Label>
                <Select value={budgetPeriod} onValueChange={(v) => { setBudgetPeriod(v); setValue('budgetPeriod', v, { shouldValidate: true }); }}>
                  <SelectTrigger id="budgetPeriod"><SelectValue placeholder="Select period" /></SelectTrigger>
                  <SelectContent>
                    {BUDGET_PERIODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.budgetPeriod && <p className="text-xs text-red-500">{errors.budgetPeriod.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocated">Allocated Amount (INR)</Label>
                <Input id="allocated" type="number" step="1" placeholder="0" {...register('allocated')} />
                {errors.allocated && <p className="text-xs text-red-500">{errors.allocated.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Budget purpose and notes..." rows={3} {...register('notes')} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Budget'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/budgets')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
