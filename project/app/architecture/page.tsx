'use client';

import { ArrowRight, Network, Shield, Server, Database, Cloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/states';
import { API_BASE_URL, gatewayUrl } from '@/lib/api/client';

const services = [
  {
    name: 'Auth/User Service',
    purpose: 'Handles authentication, authorization, and user management',
    responsibilities: ['Registration', 'Login', 'User management', 'Roles', 'JWT authentication', 'User profile'],
    dataOwnership: 'User DB',
    endpoints: ['POST /api/auth/login', 'POST /api/auth/signup', 'POST /api/auth/refresh', 'POST /api/auth/forgot-password'],
  },
  {
    name: 'Expense Service',
    purpose: 'Manages the full expense lifecycle',
    responsibilities: ['Create expenses', 'View expenses', 'Update expenses', 'Delete expenses', 'Expense approval status', 'Expense history'],
    dataOwnership: 'Expense DB',
    endpoints: ['GET /api/expenses', 'POST /api/expenses', 'GET /api/expenses/{id}', 'PUT /api/expenses/{id}', 'DELETE /api/expenses/{id}'],
  },
  {
    name: 'Budget Service',
    purpose: 'Manages budget allocation and monitoring',
    responsibilities: ['Budget creation', 'Budget allocation', 'Budget monitoring', 'Utilization tracking', 'Budget status'],
    dataOwnership: 'Budget DB',
    endpoints: ['GET /api/budgets', 'POST /api/budgets', 'GET /api/budgets/{id}', 'PUT /api/budgets/{id}'],
  },
  {
    name: 'Reconciliation Service',
    purpose: 'Compares budgets against actual expenses',
    responsibilities: ['Budget vs actual comparison', 'Variance calculation', 'Budget status determination', 'Store reconciliation results'],
    dataOwnership: 'Reconciliation Data',
    endpoints: ['GET /api/reconciliation', 'POST /api/reconciliation/run', 'GET /api/reconciliation/{id}'],
  },
  {
    name: 'Analytics Service',
    purpose: 'Provides financial insights and reporting',
    responsibilities: ['Monthly expense trends', 'Department spending', 'Category spending', 'Budget vs actual', 'Utilization analysis', 'Financial reports'],
    dataOwnership: 'Analytics Data',
    endpoints: ['GET /api/analytics/summary', 'GET /api/analytics/monthly', 'GET /api/analytics/departments', 'GET /api/analytics/categories'],
  },
];

const architectureLayers = [
  { label: 'Next.js Frontend', icon: Cloud, desc: 'TypeScript, React, Tailwind CSS, shadcn/ui' },
  { label: 'Spring Cloud API Gateway', icon: Network, desc: 'Single entry point — NEXT_PUBLIC_API_BASE_URL' },
  { label: 'JWT Authentication', icon: Shield, desc: 'Spring Security validates JWT tokens' },
  { label: 'Eureka Service Discovery', icon: Server, desc: 'Dynamic service registration and lookup' },
  { label: 'Microservices', icon: Database, desc: '5 independent services with own databases' },
];

export default function ArchitecturePage() {
  return (
    <AppShell>
      <PageHeader title="Microservice Architecture & Service Discovery" description="How FinSight is structured for a Spring Boot + Spring Cloud backend" />

      {/* Architecture diagram */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">System Architecture</CardTitle>
          <CardDescription>From frontend to microservices through the API Gateway</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {architectureLayers.map((layer, i) => (
              <div key={layer.label}>
                <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <layer.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{layer.label}</div>
                    <div className="text-xs text-muted-foreground">{layer.desc}</div>
                  </div>
                </div>
                {i < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="h-5 w-5 -rotate-90 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Microservices row */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <div key={s.name} className="rounded-lg border bg-background p-3 text-center">
                <div className="text-xs font-semibold">{s.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.dataOwnership}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Gateway section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">API Gateway Configuration</CardTitle>
          <CardDescription>The frontend uses exactly ONE API base URL — the Spring Cloud API Gateway</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm">
            <div className="text-muted-foreground">Environment Variable:</div>
            <div className="mt-1 font-semibold text-primary">NEXT_PUBLIC_API_BASE_URL</div>
            <div className="mt-2 text-muted-foreground">Example Value:</div>
            <div className="mt-1 font-semibold">{API_BASE_URL}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            The frontend does NOT create separate URLs for each microservice. All requests go through the API Gateway,
            which routes them to services discovered via Eureka.
          </p>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold mb-2">Frontend → Gateway Flow:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>1. Frontend calls <span className="font-mono text-primary">{gatewayUrl('/api/expenses')}</span></div>
              <div>2. API Gateway validates JWT token via Spring Security</div>
              <div>3. API Gateway looks up Expense Service via Eureka</div>
              <div>4. Request is routed to the discovered Expense Service instance</div>
              <div>5. Response is returned to the frontend</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service cards */}
      <h2 className="mb-4 text-lg font-semibold">Future Microservices</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((s) => (
          <Card key={s.name}>
            <CardHeader>
              <CardTitle className="text-base">{s.name}</CardTitle>
              <CardDescription>{s.purpose}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1.5">Responsibilities</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.responsibilities.map((r) => <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1.5">Data Ownership</div>
                <div className="text-sm font-medium">{s.dataOwnership}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1.5">API Endpoints</div>
                <div className="space-y-1">
                  {s.endpoints.map((e) => (
                    <div key={e} className="font-mono text-xs text-muted-foreground">{e}</div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Discovery */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Why Service Discovery (Eureka)?</CardTitle>
          <CardDescription>Eureka enables dynamic microservice registration and lookup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Avoid hard-coded service locations',
              'Dynamic service registration',
              'Dynamic service lookup',
              'Easier horizontal scaling',
              'Better maintainability',
              'Supports microservice architecture',
            ].map((reason) => (
              <div key={reason} className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-primary" />
                {reason}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border bg-primary/5 p-4 text-sm">
            <strong>Current:</strong> Frontend uses mock APIs.{' '}
            <strong>Future:</strong> The production backend will use Spring Cloud API Gateway and Eureka for service discovery.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
