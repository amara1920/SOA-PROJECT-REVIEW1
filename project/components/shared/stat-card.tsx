'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatINR, formatNumber, formatPercent } from '@/lib/format';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  type: 'currency' | 'number' | 'percent';
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({
  label,
  value,
  type,
  icon: Icon,
  trend,
  trendLabel,
  variant = 'default',
}: StatCardProps) {
  const formatted =
    type === 'currency'
      ? formatINR(value, true)
      : type === 'percent'
      ? formatPercent(value)
      : formatNumber(value);

  const variantStyles = {
    default: 'text-primary bg-primary/5',
    success: 'text-emerald-600 bg-emerald-500/5',
    warning: 'text-amber-600 bg-amber-500/5',
    danger: 'text-red-600 bg-red-500/5',
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{formatted}</p>
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', variantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {trend >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span className={cn(trend >= 0 ? 'text-emerald-600' : 'text-red-600', 'font-medium')}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
