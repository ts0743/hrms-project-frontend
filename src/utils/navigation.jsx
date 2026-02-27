import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  TrendingUp,
  FileText,
  UserCircle,
  ClipboardList,
} from "lucide-react";

// Navigation arrays for different roles
const ADMIN_NAV = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Employee Management", path: "/employees", icon: Users },
  { title: "Attendance", path: "/attendance", icon: CalendarCheck },
  { title: "Leave Management", path: "/leave", icon: CalendarDays },
  { title: "Performance", path: "/performance", icon: TrendingUp },
  { title: "Reports", path: "/reports", icon: FileText },
];

const HR_NAV = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Employees", path: "/employees", icon: Users },
  { title: "Attendance", path: "/attendance", icon: CalendarCheck },
  { title: "Leave Approval", path: "/leave", icon: CalendarDays },
  { title: "Performance Review", path: "/performance", icon: TrendingUp },
];

const EMPLOYEE_NAV = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "My Attendance", path: "/attendance", icon: CalendarCheck },
  { title: "Apply Leave", path: "/leave", icon: ClipboardList },
  { title: "My Performance", path: "/performance", icon: TrendingUp },
  { title: "Profile", path: "/profile", icon: UserCircle },
];

// Function to get navigation items based on user role
export function getNavItems(role) {
  switch (role) {
    case "ADMIN":
      return ADMIN_NAV;
    case "HR":
      return HR_NAV;
    case "EMPLOYEE":
      return EMPLOYEE_NAV;
    default:
      return [];
  }
}
