import { useState, useEffect, useMemo } from "react";
import { TrendingUp, Star, Award, Search, FileText, X } from "lucide-react";
import {
  PageHeader,
  LoadingOverlay,
  ErrorState,
  StatusBadge,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Rating } from "@/components/ui/rating";

import { useAuthStore } from "@/stores/authStore";
import { performanceService, employeeService } from "@/api";

export default function PerformanceModule() {
  const user = useAuthStore((s) => s.user);

  const isEmployee = user?.role === "EMPLOYEE";
  const canViewAll =
    user?.role === "HR" || user?.role === "ADMIN" || user?.role === "MANAGER";

  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // FETCH DATA (same pattern as attendance)
  const fetchData = async () => {
    if (!user?.role) return;

    setLoading(true);
    setError(null);

    try {
      // STEP 1 — fetch employees first
      const employeeData = await employeeService.getAll();
      const employeeList =
        Array.isArray(employeeData)
          ? employeeData
          : Array.isArray(employeeData?.data)
          ? employeeData.data
          : employeeData?.content || [];

      setEmployees(employeeList);

      let performanceData = [];

      if (isEmployee) {
        // STEP 2 — get employeeId safely
        let employeeId = user?.id;

        // fallback → match by email
        if (!employeeId && user?.email && employeeList.length) {
          const matchedEmployee = employeeList.find(
            (emp) => emp.email === user.email
          );
          employeeId = matchedEmployee?.id;
        }

        if (!employeeId) {
          console.warn("Employee ID not found for current user:", user);
          setReviews([]);
        } else {
          const res = await performanceService.getByEmployee(employeeId);
          performanceData = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
            ? res.data
            : res?.content || [];

          setReviews(performanceData);
        }
      } else {
        // HR/Admin/Manager → fetch all
        const res = await performanceService.getAll();
        performanceData = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : res?.content || [];

        setReviews(performanceData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch performance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Employee map (same as attendance)
  const employeeMap = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      map[String(emp.id)] = `${emp.firstName} ${emp.lastName}`;
    });
    return map;
  }, [employees]);

  const getEmployeeName = (id) =>
    employeeMap[String(id)] || "Staff Member";

  const getStatus = (rev) => {
    if (rev.rating && rev.feedback) return "COMPLETED";
    if (!rev.rating && !rev.feedback) return "PENDING";
    return "IN_PROGRESS";
  };

  const filteredReviews = reviews.filter((rev) =>
    isEmployee
      ? true
      : getEmployeeName(rev.employeeId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );

  const avgRating = (
    reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
    Math.max(reviews.length, 1)
  ).toFixed(1);

  const completedCount = reviews.filter((r) => r.rating && r.feedback).length;
  const pendingCount = reviews.length - completedCount;

  const highestRating = reviews.reduce(
    (max, r) => (Number(r.rating || 0) > Number(max.rating || 0) ? r : max),
    { rating: 0 }
  );

  const topEmployee = highestRating.employeeId
    ? getEmployeeName(highestRating.employeeId)
    : "-";

  const openModal = (review) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  if (loading) return <LoadingOverlay text="Loading Performance Data..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEmployee ? "My Performance" : "Performance Reviews"}
        subtitle={
          isEmployee
            ? "View your personal performance review"
            : "View employee performance records"
        }
      />

      {/* Metrics */}
      {!isEmployee && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Company Avg Rating" value={`${avgRating}/5`} />
          <MetricCard title="Reviews Completed" value={completedCount} />
          <MetricCard title="Pending Reviews" value={pendingCount} />
          <MetricCard title="Top Rated Employee" value={topEmployee} />
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Records</CardTitle>

          {canViewAll && !isEmployee && (
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4" />
              <Input
                placeholder="Search employee..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Review Date</TableHead>
                {!isEmployee && <TableHead />}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No performance records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell>
                      {isEmployee
                        ? user?.name
                        : getEmployeeName(rev.employeeId)}
                    </TableCell>

                    <TableCell>{rev.rating || "-"}</TableCell>

                    <TableCell>
                      <StatusBadge status={getStatus(rev)} />
                    </TableCell>

                    <TableCell>
                      {rev.reviewDate
                        ? new Date(rev.reviewDate).toLocaleDateString()
                        : "Not reviewed"}
                    </TableCell>

                    {!isEmployee && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal(rev)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Performance Report</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" className="absolute right-3 top-3">
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-3 mt-4">
              <p>Employee: {getEmployeeName(selectedReview.employeeId)}</p>
              <p>Status: {getStatus(selectedReview)}</p>
              <Rating value={Number(selectedReview.rating || 0)} readOnly />
              <p>Goal: {selectedReview.goal || "No goal defined"}</p>
              <p>Feedback: {selectedReview.feedback || "No feedback provided"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Metric Card
const MetricCard = ({ title, value }) => (
  <Card>
    <CardContent className="p-6">
      <p className="text-xs text-muted-foreground uppercase">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);
