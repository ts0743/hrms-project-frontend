import React from "react";
import { Bell, Search, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BREADCRUMB_MAP = {
  "/": "Dashboard",
  "/employees": "Employee Management",
  "/attendance": "Attendance",
  "/leave": "Leave Management",
  "/performance": "Performance",
  "/reports": "Reports",
  "/profile": "Profile",
};

export function TopHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pageTitle = BREADCRUMB_MAP[location.pathname] || "Dashboard";

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-xs text-muted-foreground">
            Home / {pageTitle}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-56 pl-9 h-9 bg-muted/50 border-none text-sm"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
              
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>

              {/* Name + Role */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground leading-none">
                  {user?.name}
                </p>

                {/* SAFE — Badge inside div (or even p now works because Badge = span) */}
                <div className="text-xs text-muted-foreground mt-0.5">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {user?.role}
                  </Badge>
                </div>
              </div>

            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}

