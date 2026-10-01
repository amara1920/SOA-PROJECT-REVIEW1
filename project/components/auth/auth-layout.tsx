'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="relative hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary to-chart-5 p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold">FinSight</div>
            <div className="text-sm text-primary-foreground/80">Corporate Financial Intelligence</div>
          </div>
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Corporate Financial Expense Analytics & Budget Reconciliation
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Track expenses, monitor budgets, run reconciliation, and gain financial insights —
            all in one centralized platform.
          </p>
          <div className="mt-8 space-y-3">
            {['Expense tracking & approval workflows', 'Budget monitoring with variance analysis', 'Role-based access for 4 user types', 'Designed for Spring Boot microservices'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm text-primary-foreground/60">
          Review 1 Project — Frontend with Mock APIs
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">FinSight</span>
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

