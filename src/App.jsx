import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import EmployeeList from "@/pages/employees/EmployeeList";
import AttendanceView from "@/pages/attendance/AttendanceView";
import LeaveManagement from "@/pages/leave/LeaveManagement";
import PerformanceView from "@/pages/performance/PerformanceView";
import Reports from "@/pages/reports/Reports";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const initialize = useAuthStore((s) => s.initialize);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route path="/attendance" element={<AttendanceView />} />
        <Route path="/leave" element={<LeaveManagement />} />
        <Route path="/performance" element={<PerformanceView />} />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
