'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { getNavItemsForRole, isRouteAllowed } from '@/lib/auth/nav-config';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';
import { notificationsApi } from '@/lib/api/notifications';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  CheckCircle,
  Scale,
  BarChart3,
  Users,
  Network,
  Bell,
  Settings,
  LogOut,
  User as UserIcon,
  HelpCircle,
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
  TrendingUp,
  FileText,
  GraduationCap,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { AppNotification, Expense, Budget, User as UserType } from '@/types';
import { mockExpenses, mockBudgets, mockUsers } from '@/lib/mock-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Receipt,
  Wallet,
  CheckCircle,
  Scale,
  BarChart3,
  Users,
  Network,
  Bell,
  Settings,
  FileText,
  GraduationCap,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, hasRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    if (!isRouteAllowed(pathname, user.role)) {
      router.push('/dashboard');
    }
  }, [user, pathname, router]);

  useEffect(() => {
    if (user) {
      notificationsApi.unreadCount().then(setUnreadCount);
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading FinSight...</div>
      </div>
    );
  }

  if (!user) return null;

  if (!isRouteAllowed(pathname, user.role)) {
    return <AccessDenied />;
  }

  const navItems = getNavItemsForRole(user.role);

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out successfully', description: 'You have been signed out of FinSight.' });
  };

  // Global search
  const searchResults = searchQuery.length > 1 ? getSearchResults(searchQuery) : [];

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight">FinSight</div>
          <div className="text-xs text-muted-foreground">Financial Intelligence</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.href === '/notifications' && unreadCount > 0 && (
                <Badge className="h-5 min-w-5 justify-center px-1.5 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 space-y-1">
        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
        >
          <UserIcon className="h-4 w-4" />
          Profile
        </Link>
        <Link
          href="/architecture"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Help & Architecture
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  // Breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        {sidebar}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Breadcrumbs */}
          <nav className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <Link href="/dashboard" className="hover:text-foreground">Home</Link>
            {breadcrumbs.map((bc) => (
              <span key={bc.href} className="flex items-center gap-2">
                <span>/</span>
                <Link href={bc.href} className="hover:text-foreground">{bc.label}</Link>
              </span>
            ))}
          </nav>

          {/* Search */}
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses, budgets, users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(e.target.value.length > 1);
              }}
              onFocus={() => searchQuery.length > 1 && setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              className="pl-9"
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-popover shadow-lg">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      router.push(r.href);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-accent/10"
                  >
                    <r.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-medium leading-tight">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role.replace(/_/g, ' ')}</div>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <UserIcon className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-7xl p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <ShieldIcon className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-center text-muted-foreground max-w-md">
        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link href="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  );
}

interface SearchResult {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getSearchResults(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  mockExpenses
    .filter((e) => e.id.toLowerCase().includes(q) || e.employeeName.toLowerCase().includes(q))
    .slice(0, 5)
    .forEach((e: Expense) => {
      results.push({
        title: e.id,
        subtitle: `${e.employeeName} • ${e.category}`,
        href: `/expenses/${e.id}`,
        icon: Receipt,
      });
    });

  mockBudgets
    .filter((b) => b.department.toLowerCase().includes(q) || b.id.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((b: Budget) => {
      results.push({
        title: b.id,
        subtitle: `${b.department} • ${b.financialYear}`,
        href: `/budgets/${b.id}`,
        icon: Wallet,
      });
    });

  mockUsers
    .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    .slice(0, 3)
    .forEach((u: UserType) => {
      results.push({
        title: u.name,
        subtitle: `${u.email} • ${u.role.replace(/_/g, ' ')}`,
        href: `/users`,
        icon: Users,
      });
    });

  return results.slice(0, 8);
}
