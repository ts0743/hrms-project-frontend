import React, { Suspense } from "react";
import { useAuthStore } from "@/stores/authStore";

// Role constants
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  EMPLOYEE: "EMPLOYEE",
};

// Lazy load dashboards for performance
const AdminDashboard = React.lazy(() => import("./dashboard/AdminDashboard"));
const HRDashboard = React.lazy(() => import("./dashboard/HrDashboard"));
const EmployeeDashboard = React.lazy(() => import("./dashboard/EmployeeDashboard"));

export default function Dashboard() {
  const user = useAuthStore(s => s.user);

  // Show loading while user info is not ready
  if (!user) {
    return <p>Loading dashboard...</p>;
  }

  let DashboardComponent;

  switch (user.role) {
    case ROLES.ADMIN:
      DashboardComponent = AdminDashboard;
      break;
    case ROLES.HR:
      DashboardComponent = HRDashboard;
      break;
    case ROLES.EMPLOYEE:
      DashboardComponent = EmployeeDashboard;
      break;
    default:
      return <p>Unauthorized or unknown role</p>;
  }

  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <DashboardComponent />
    </Suspense>
  );
}
