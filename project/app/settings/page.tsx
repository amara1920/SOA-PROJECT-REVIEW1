'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Palette, Shield, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/hooks/use-toast';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/states';
import { RoleBadge } from '@/components/shared/status-badges';
import { ChangePasswordDialog } from '@/components/shared/change-password-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const SETTINGS_KEY = 'finsight_settings';
const THEME_KEY = 'finsight_theme';

interface AppSettings {
  emailNotifications: boolean;
  expenseNotifications: boolean;
  approvalNotifications: boolean;
  budgetAlerts: boolean;
  reconciliationAlerts: boolean;
}

const defaultSettings: AppSettings = {
  emailNotifications: true,
  expenseNotifications: true,
  approvalNotifications: true,
  budgetAlerts: true,
  reconciliationAlerts: true,
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [pwOpen, setPwOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(SETTINGS_KEY) : null;
    if (stored) {
      try { setSettings({ ...defaultSettings, ...JSON.parse(stored) }); } catch { /* noop */ }
    }
    const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null;
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      setTheme(storedTheme);
    }
  }, []);

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    toast({ title: 'Settings updated', description: 'Your notification preferences have been saved.' });
  };

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    setTheme(t);
    if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (t === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
    toast({ title: 'Appearance updated', description: `Theme set to ${t}.` });
  };

  if (!user) return null;

  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage your account, notifications, appearance, and security preferences" />

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="account"><User className="mr-1.5 h-4 w-4" /> Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-1.5 h-4 w-4" /> Appearance</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-1.5 h-4 w-4" /> Security</TabsTrigger>
        </TabsList>

        {/* Account */}
        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Account Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem label="Name" value={user.name} />
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Department" value={user.department} />
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Role</div>
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Update your profile details, name, email, and department.</p>
                <Button variant="outline" onClick={() => router.push('/profile')}>
                  Edit Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <SettingRow
                label="Email Notifications"
                description="Receive notifications via email"
                checked={settings.emailNotifications}
                onChange={(v) => updateSetting('emailNotifications', v)}
              />
              <SettingRow
                label="Expense Notifications"
                description="Get notified about expense submissions and status changes"
                checked={settings.expenseNotifications}
                onChange={(v) => updateSetting('expenseNotifications', v)}
              />
              <SettingRow
                label="Approval Notifications"
                description="Get notified when expenses need approval or are approved"
                checked={settings.approvalNotifications}
                onChange={(v) => updateSetting('approvalNotifications', v)}
              />
              <SettingRow
                label="Budget Alerts"
                description="Receive alerts when budgets approach or exceed limits"
                checked={settings.budgetAlerts}
                onChange={(v) => updateSetting('budgetAlerts', v)}
              />
              <SettingRow
                label="Reconciliation Alerts"
                description="Get notified about reconciliation updates and due dates"
                checked={settings.reconciliationAlerts}
                onChange={(v) => updateSetting('reconciliationAlerts', v)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Theme</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Choose how FinSight looks to you.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => applyTheme(t)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent/10',
                      theme === t && 'border-primary bg-primary/5'
                    )}
                  >
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      theme === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <Palette className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium capitalize">{t}</div>
                      <div className="text-xs text-muted-foreground">
                        {t === 'light' ? 'Bright interface' : t === 'dark' ? 'Dark interface' : 'Follow system'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Security & Authentication</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Password Management</div>
                    <div className="text-xs text-muted-foreground">Change your account password</div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setPwOpen(true)}>Change Password</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Authentication Status</div>
                    <div className="text-xs text-muted-foreground">JWT authentication will be integrated with Spring Security in the backend.</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600">Mock Session Active</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Session</div>
                    <div className="text-xs text-muted-foreground">Your session is preserved across browser refreshes.</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Active</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
    </AppShell>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function SettingRow({
  label, description, checked, onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
