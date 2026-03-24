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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Rating } from "@/components/ui/rating";

import { useAuthStore } from "@/stores/authStore";
import { performanceService, employeeService } from "@/api";

export default function PerformanceModule() {
  const user = useAuthStore((s) => s.user);

  const isEmployee = user?.role === "EMPLOYEE";
  const isHR = user?.role === "HR";
  const canViewAll =
    user?.role === "HR" || user?.role === "ADMIN" || user?.role === "MANAGER";

  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [newReview, setNewReview] = useState({
    employeeId: "",
    rating: 0,
    goal: "",
    feedback: "",
    reviewDate: "",
    reviewerId: user?.id || "",
  });

  const fetchData = async () => {
    if (!user?.role) return;

    setLoading(true);
    setError(null);

    try {
      const employeeData = await employeeService.getAll();
      const employeeList = Array.isArray(employeeData)
        ? employeeData
        : Array.isArray(employeeData?.data)
        ? employeeData.data
        : employeeData?.content || [];

      setEmployees(employeeList);

      let performanceData = [];

      if (isEmployee) {
        let employeeId = user?.id;

        if (!employeeId && user?.email && employeeList.length) {
          const matchedEmployee = employeeList.find(
            (emp) => emp.email === user.email
          );
          employeeId = matchedEmployee?.id;
        }

        if (!employeeId) {
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Records</CardTitle>

          {isHR && (
            <Button
              onClick={() => {
                setSelectedReview(null);
                setNewReview({
                  employeeId: "",
                  rating: 0,
                  goal: "",
                  feedback: "",
                  reviewDate: "",
                  reviewerId: user?.id || "",
                });
                setModalOpen(true);
              }}
            >
              Add Review
            </Button>
          )}

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
                <TableHead>Goal</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Review Date</TableHead>
                {!isEmployee ? <TableHead /> : null}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No performance records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell>
                      {isEmployee
                        ? user?.username
                        : getEmployeeName(rev.employeeId)}
                    </TableCell>
                    <TableCell>{rev.rating || "-"}</TableCell>
                    <TableCell>
                      <StatusBadge status={getStatus(rev)} />
                    </TableCell>
                    <TableCell>{rev.goal || "-"}</TableCell>
                    <TableCell>{rev.feedback || "-"}</TableCell>
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

          {selectedReview ? (
            <div className="space-y-3 mt-4">
              <p>Employee: {getEmployeeName(selectedReview.employeeId)}</p>
              <Rating value={Number(selectedReview.rating || 0)} readOnly />
              <p>Goal: {selectedReview.goal || "-"}</p>
              <p>Feedback: {selectedReview.feedback || "-"}</p>
            </div>
          ) : (
            isHR && (
              <div className="space-y-4 mt-4">

                <select
                  className="w-full border rounded p-2"
                  value={newReview.employeeId}
                  onChange={(e) =>
                    setNewReview({ ...newReview, employeeId: e.target.value })
                  }
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>

                <Rating
                  value={newReview.rating}
                  onChange={(val) =>
                    setNewReview({ ...newReview, rating: val })
                  }
                />

                <Input
                  placeholder="Goal"
                  value={newReview.goal}
                  onChange={(e) =>
                    setNewReview({ ...newReview, goal: e.target.value })
                  }
                />

                <Input
                  placeholder="Feedback"
                  value={newReview.feedback}
                  onChange={(e) =>
                    setNewReview({ ...newReview, feedback: e.target.value })
                  }
                />

                <Input
                  type="date"
                  value={newReview.reviewDate}
                  onChange={(e) =>
                    setNewReview({ ...newReview, reviewDate: e.target.value })
                  }
                />

                <Input
                  placeholder="Reviewer ID"
                  value={newReview.reviewerId}
                  onChange={(e) =>
                    setNewReview({ ...newReview, reviewerId: e.target.value })
                  }
                />

                <Button
                  onClick={async () => {
                    try {
                      if (
                        !newReview.employeeId ||
                        !newReview.goal ||
                        !newReview.rating ||
                        !newReview.reviewDate ||
                        !newReview.reviewerId
                      ) {
                        alert("Please fill all required fields.");
                        return;
                      }

                      const payload = {
                        employeeId: Number(newReview.employeeId),
                        goal: newReview.goal.trim(),
                        rating: String(newReview.rating),
                        feedback: newReview.feedback?.trim() || "",
                        reviewDate: newReview.reviewDate,
                        reviewerId: Number(newReview.reviewerId),
                      };

                      await performanceService.create(payload);

                      setModalOpen(false);

                      setNewReview({
                        employeeId: "",
                        rating: 0,
                        goal: "",
                        feedback: "",
                        reviewDate: "",
                        reviewerId: user?.id || "",
                      });

                      fetchData();
                    } catch (err) {
                      console.error("Create review error:", err);
                      alert("Failed to submit review.");
                    }
                  }}
                >
                  Submit Review
                </Button>

              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
