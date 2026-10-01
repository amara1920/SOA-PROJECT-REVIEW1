'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Shield, UserCheck, UserX, Search } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/format';
import { ROLES } from '@/lib/constants';
import type { User, UserRole } from '@/types';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/shared/states';
import { RoleBadge } from '@/components/shared/status-badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { getInitials } from '@/lib/format';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [roleDialog, setRoleDialog] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');
  const [statusDialog, setStatusDialog] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
  });

  const handleChangeRole = async () => {
    if (!roleDialog || !newRole) return;
    setActionLoading(true);
    try {
      await usersApi.updateRole(roleDialog.id, newRole as UserRole);
      setUsers((prev) => prev.map((u) => (u.id === roleDialog.id ? { ...u, role: newRole as UserRole } : u)));
      toast({ title: 'Role updated', description: `${roleDialog.name} is now ${newRole.replace(/_/g, ' ')}.` });
      setRoleDialog(null);
    } catch {
      toast({ title: 'Error', description: 'Could not update role.', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusDialog) return;
    setActionLoading(true);
    try {
      const updated = await usersApi.toggleStatus(statusDialog.id);
      setUsers((prev) => prev.map((u) => (u.id === statusDialog.id ? updated : u)));
      toast({ title: `User ${updated.status === 'Active' ? 'activated' : 'deactivated'}`, description: `${statusDialog.name} is now ${updated.status}.` });
      setStatusDialog(null);
    } catch {
      toast({ title: 'Error', description: 'Could not update status.', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="User Management"
        description="Manage user roles and account status"
        action={<Button variant="outline" onClick={load}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>}
      />

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : loading ? (
        <LoadingState message="Loading users..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No users found" message="No users match your search." />
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell className="text-sm">{u.department}</TableCell>
                  <TableCell><RoleBadge role={u.role} /></TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'Active' ? 'default' : 'secondary'} className={u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(u.joinedDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setRoleDialog(u); setNewRole(u.role); }}>
                      <Shield className="mr-1 h-3.5 w-3.5" /> Role
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setStatusDialog(u)} className={u.status === 'Active' ? 'text-amber-600' : 'text-emerald-600'}>
                      {u.status === 'Active' ? <><UserX className="mr-1 h-3.5 w-3.5" /> Deactivate</> : <><UserCheck className="mr-1 h-3.5 w-3.5" /> Activate</>}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Change Role Dialog */}
      <Dialog open={!!roleDialog} onOpenChange={(o) => !o && setRoleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Select a new role for {roleDialog?.name}.</DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialog(null)}>Cancel</Button>
            <Button onClick={handleChangeRole} disabled={actionLoading || !newRole}>
              {actionLoading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Dialog */}
      <Dialog open={!!statusDialog} onOpenChange={(o) => !o && setStatusDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{statusDialog?.status === 'Active' ? 'Deactivate User' : 'Activate User'}</DialogTitle>
            <DialogDescription>
              {statusDialog?.status === 'Active'
                ? `Are you sure you want to deactivate ${statusDialog?.name}? They will lose access to the system.`
                : `Are you sure you want to activate ${statusDialog?.name}? They will regain access to the system.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialog(null)}>Cancel</Button>
            <Button
              variant={statusDialog?.status === 'Active' ? 'destructive' : 'default'}
              onClick={handleToggleStatus}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : statusDialog?.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
