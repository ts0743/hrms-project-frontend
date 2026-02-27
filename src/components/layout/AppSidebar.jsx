import { useLocation, Link } from "react-router-dom";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getNavItems } from "@/utils/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary/20">
          <Building2 className="w-5 h-5 text-sidebar-primary" />
        </div>
        {!collapsed && (
          <span className="text-base font-semibold text-sidebar-primary-foreground tracking-tight">
            HRIS Pro
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-link",
                isActive ? "sidebar-link-active" : "sidebar-link-inactive"
              )}
              title={item.title}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-primary transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
