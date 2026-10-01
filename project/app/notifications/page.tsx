'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Trash2, Search, Receipt, CheckCircle, Wallet, Scale } from 'lucide-react';
import { notificationsApi } from '@/lib/api/notifications';
import { useToast } from '@/hooks/use-toast';
import { formatDateTime } from '@/lib/format';
import type { AppNotification, NotificationType } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const typeIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  expense: Receipt,
  approval: CheckCircle,
  budget: Wallet,
  reconciliation: Scale,
};

const typeColors: Record<NotificationType, string> = {
  expense: 'bg-blue-500/10 text-blue-500',
  approval: 'bg-violet-500/10 text-violet-500',
  budget: 'bg-amber-500/10 text-amber-500',
  reconciliation: 'bg-emerald-500/10 text-emerald-500',
};

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await notificationsApi.list();
      setNotifications(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = notifications.filter((n) => {
    if (search) {
      const q = search.toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q)) return false;
    }
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (filterRead === 'unread' && n.read) return false;
    if (filterRead === 'read' && !n.read) return false;
    return true;
  });

  const handleMarkRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    toast({ title: 'Notification marked as read.' });
  };

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ title: 'All notifications marked as read.' });
  };

  const handleDelete = async (id: string) => {
    await notificationsApi.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({ title: 'Notification deleted.' });
  };

  const handleView = (n: AppNotification) => {
    if (!n.read) handleMarkRead(n.id);
    if (n.link) router.push(n.link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread of ${notifications.length} total notifications`}
        action={
          <Button variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" /> Mark All Read
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="approval">Approval</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="reconciliation">Reconciliation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRead} onValueChange={setFilterRead}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : loading ? (
        <LoadingState message="Loading notifications..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications found" message="You're all caught up. New notifications will appear here." />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <Card key={n.id} className={cn('transition-colors', !n.read && 'border-primary/30 bg-primary/5')}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', typeColors[n.type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{n.title}</h3>
                      {!n.read && <Badge className="h-5 px-1.5 text-xs">New</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {n.link && (
                      <Button variant="ghost" size="sm" onClick={() => handleView(n)} className="text-xs">
                        View
                      </Button>
                    )}
                    {!n.read && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMarkRead(n.id)} aria-label="Mark as read">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(n.id)} aria-label="Delete notification">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
