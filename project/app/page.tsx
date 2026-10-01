'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Wallet,
  BarChart3,
  Scale,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Network,
  Building2,
} from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">FinSight</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-5/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Corporate Financial Intelligence, Simplified
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Corporate Financial Expense
              <br />
              <span className="text-primary">Analytics & Budget Reconciliation</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              A centralized platform for expense tracking, budget monitoring, reconciliation,
              and financial analytics across all departments — with role-based access and secure authentication.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Sign In to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/review1">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Review 1 Presentation
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Budget', value: '₹50 L' },
              { label: 'Departments', value: '6' },
              { label: 'Microservices', value: '5' },
              { label: 'User Roles', value: '4' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need for financial oversight</h2>
            <p className="mt-2 text-muted-foreground">Comprehensive tools for corporate expense and budget management</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Wallet, title: 'Expense Tracking', desc: 'Create, submit, and track expenses across all departments with full approval workflows.' },
              { icon: TrendingUp, title: 'Budget Monitoring', desc: 'Monitor allocated budgets vs actual spending with real-time utilization metrics.' },
              { icon: Scale, title: 'Reconciliation', desc: 'Automated variance calculation and budget status determination for every department.' },
              { icon: BarChart3, title: 'Financial Analytics', desc: 'Interactive charts for monthly trends, department spending, and category breakdowns.' },
              { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Four distinct roles — Admin, Finance Manager, Department Manager, and Employee.' },
              { icon: Network, title: 'Microservice Ready', desc: 'Designed for Spring Cloud API Gateway with Eureka service discovery architecture.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border bg-background p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture preview */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Built for the future</h2>
          <p className="mt-2 text-muted-foreground">Frontend ready to connect to a Java Spring Boot microservices backend</p>
          <div className="mt-12 space-y-4">
            {['Next.js Frontend', 'Spring Cloud API Gateway', 'JWT Authentication', 'Eureka Service Discovery', '5 Microservices'].map((layer, i) => (
              <div key={layer} className="flex flex-col items-center gap-2">
                <div className="rounded-xl border bg-card px-8 py-4 font-semibold shadow-sm w-full max-w-md text-center">
                  {layer}
                </div>
                {i < 4 && <ArrowRight className="h-5 w-5 -rotate-90 text-muted-foreground" />}
              </div>
            ))}
          </div>
          <Link href="/architecture" className="mt-8 inline-block">
            <Button variant="outline">Explore Architecture</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <span>FinSight – Corporate Financial Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/requirements">Requirements</Link>
            <Link href="/architecture">Architecture</Link>
            <Link href="/review1">Review 1</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
