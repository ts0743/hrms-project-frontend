import { useState, useEffect, useMemo } from "react";
import { CalendarCheck, Download } from "lucide-react";
import {
  PageHeader,
  EmptyState,
  LoadingOverlay,
  ErrorState,
  StatusBadge,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

import { attendanceService, employeeService } from "@/api";
import { useAuthStore } from "@/stores/authStore";

const AttendancePage = () => {
  const user = useAuthStore((s) => s.user);

  const isEmployee = user?.role === "EMPLOYEE";
  const isAdminOrHR = user?.role === "ADMIN" || user?.role === "HR";

  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchData = async () => {
    if (!user?.role) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all employees for mapping and ID lookup
      const employeeData = await employeeService.getAll();
      const employeeList =
        Array.isArray(employeeData)
          ? employeeData
          : Array.isArray(employeeData?.data)
          ? employeeData.data
          : employeeData?.content || [];
      setEmployees(employeeList);

      let attendanceResponse = [];

      if (isEmployee) {
        // Use user.id if available, otherwise match by email
        let employeeId = user?.id;
        if (!employeeId && user?.email && employeeList.length) {
          const matchedEmployee = employeeList.find(
            (emp) => emp.email === user.email
          );
          employeeId = matchedEmployee?.id;
        }

        if (!employeeId) {
          console.warn("Employee ID not found for current user:", user);
          setAttendance([]);
        } else {
          const response = await attendanceService.getByEmployee(employeeId);
          attendanceResponse = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : response?.content || [];
          setAttendance(attendanceResponse);
        }
      } else if (isAdminOrHR) {
        // Admin/HR → fetch all attendance
        const response = await attendanceService.getAll();
        attendanceResponse = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : response?.content || [];
        setAttendance(attendanceResponse);
      }
    } catch (err) {
      setError(
        "Failed to load attendance data. Please check your API connection."
      );
      console.error(err);
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

  const getEmployeeName = (empId) =>
    employeeMap[String(empId)] || "Unknown Staff";

  const filteredAttendance = useMemo(() => {
    return attendance.filter((att) => {
      const recordEmpId = att.employeeId || att.employee?.id;
      if (
        selectedEmployee !== "all" &&
        String(recordEmpId) !== String(selectedEmployee)
      )
        return false;
      if (selectedDate && att.date !== selectedDate) return false;
      if (selectedStatus !== "all" && att.status !== selectedStatus) return false;
      return true;
    });
  }, [attendance, selectedEmployee, selectedDate, selectedStatus]);

  const stats = useMemo(
    () => ({
      total: filteredAttendance.length,
      present: filteredAttendance.filter((a) => a.status === "PRESENT").length,
      leave: filteredAttendance.filter((a) => a.status === "LEAVE").length,
      wfh: filteredAttendance.filter((a) => a.status === "WFH").length,
    }),
    [filteredAttendance]
  );

  const exportToCSV = () => {
    if (!filteredAttendance.length) {
      alert("No data available to export");
      return;
    }

    const headers = ["Employee Name", "Date", "Status", "Working Hours"];
    const rows = filteredAttendance.map((record) => [
      getEmployeeName(record.employeeId || record.employee?.id),
      record.date || "N/A",
      record.status || "N/A",
      record.workingHours ? `${record.workingHours}h` : "--",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute(
      "download",
      `attendance_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.setAttribute("href", encodedUri);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LoadingOverlay text="Loading attendance records..." />;
  if (error)
    return <ErrorState message={error} onRetry={fetchData} variant="page" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEmployee ? "My Attendance" : "Attendance Management"}
        subtitle={
          isEmployee
            ? "Track your daily attendance"
            : "Monitor organization-wide attendance"
        }
        actions={
          isAdminOrHR && (
            <Button variant="outline" className="gap-2" onClick={exportToCSV}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Present" value={stats.present} color="success" />
        <StatCard label="On Leave" value={stats.leave} color="warning" />
        <StatCard label="WFH" value={stats.wfh} color="info" />
      </div>

      {isAdminOrHR && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PRESENT">Present</SelectItem>
                  <SelectItem value="LEAVE">On Leave</SelectItem>
                  <SelectItem value="WFH">Work from Home</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => {
                  setSelectedEmployee("all");
                  setSelectedDate("");
                  setSelectedStatus("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAttendance.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={CalendarCheck}
              title="No attendance records"
              description="No attendance records match your filters"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Working Hours</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {getEmployeeName(record.employeeId || record.employee?.id)}
                    </TableCell>
                    <TableCell>
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={record.status}
                        variant="attendance"
                      />
                    </TableCell>
                    <TableCell>
                      {record.workingHours ? `${record.workingHours}h` : "--"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const colorStyles = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  info: "bg-blue-50 text-blue-700 border-blue-100",
};

const StatCard = ({ label, value, color }) => (
  <div className={`rounded-xl border p-4 shadow-sm ${colorStyles[color]}`}>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs font-medium uppercase tracking-wider opacity-80">
      {label}
    </p>
  </div>
);

export default AttendancePage;
