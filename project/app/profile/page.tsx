'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, KeyRound, Shield, Mail, Building2, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/hooks/use-toast';
import { DEPARTMENTS } from '@/lib/constants';
import { getInitials, formatDate } from '@/lib/format';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/states';
import { RoleBadge } from '@/components/shared/status-badges';
import { ChangePasswordDialog } from '@/components/shared/change-password-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { Department } from '@/types';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  department: z.string().min(1, 'Department is required'),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [dept, setDept] = useState(user?.department || '');

  const nameParts = (user?.name || '').split(' ');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user?.email || '',
      department: user?.department || '',
    },
  });

  if (!user) return null;

  const onSubmit = async (data: ProfileValues) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser({
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      department: data.department as Department,
    });
    setLoading(false);
    toast({ title: 'Profile updated successfully', description: 'Your profile information has been saved.' });
  };

  return (
    <AppShell>
      <PageHeader title="Profile" description="View and update your account information" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-3">
              <RoleBadge role={user.role} />
            </div>
            <Separator className="my-4" />
            <div className="w-full space-y-3 text-left">
              <InfoRow icon={Building2} label="Department" value={user.department} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Shield} label="Account Status" value="Active" />
              <InfoRow icon={Calendar} label="Joined" value={formatDate('2023-01-15')} />
            </div>
          </CardContent>
        </Card>

        {/* Edit form + Security */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Edit Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register('firstName')} />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register('lastName')} />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={dept}
                    onValueChange={(v) => { setDept(v); setValue('department', v, { shouldValidate: true }); }}
                  >
                    <SelectTrigger id="department"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={user.role} />
                    <span className="text-xs text-muted-foreground">Role changes are managed by administrators in User Management.</span>
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security section */}
          <Card>
            <CardHeader><CardTitle className="text-base">Security</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Password</div>
                    <div className="text-xs text-muted-foreground">Change your account password</div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setPwOpen(true)}>Change Password</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Authentication</div>
                    <div className="text-xs text-muted-foreground">JWT authentication will be integrated with Spring Security in the backend.</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600">Mock Session Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
    </AppShell>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
