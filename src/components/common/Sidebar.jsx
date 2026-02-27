import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CalendarDays, 
  TrendingUp,
  Settings,
  HelpCircle,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const mainNavItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Employees', href: '/employees', icon: Users },
  { title: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { title: 'Leave Management', href: '/leave', icon: CalendarDays, badge: 5 },
  { title: 'Performance', href: '/performance', icon: TrendingUp },
];

const secondaryNavItems = [
  { title: 'Settings', href: '/settings', icon: Settings },
  { title: 'Help & Support', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex h-16 items-center border-b border-sidebar-border px-4",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">HR Portal</span>
            <span className="text-xs text-sidebar-muted">Enterprise Suite</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className={cn("mb-2", !collapsed && "px-2")}>
          {!collapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
              Main Menu
            </span>
          )}
        </div>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )
            }
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs font-medium text-sidebar-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className={cn("mb-2 mt-6", !collapsed && "px-2")}>
          {!collapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
              Support
            </span>
          )}
        </div>
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )
            }
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="mr-3 h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
