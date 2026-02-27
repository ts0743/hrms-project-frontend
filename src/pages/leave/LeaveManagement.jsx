import { useState, useEffect } from 'react';
import { Calendar, Plus, Check, X } from 'lucide-react';
import {
  PageHeader,
  EmptyState,
  LoadingOverlay,
  ErrorState,
  StatusBadge,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { leaveService, employeeService } from '@/api';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

const LeaveManagementPage = () => {
  const user = useAuthStore((s) => s.user);
  const isEmployee = user?.role === 'EMPLOYEE';
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [applyOpen, setApplyOpen] = useState(false);
  const [formData, setFormData] = useState({ leaveType: '', from: '', to: '', reason: '' });

  const { toast } = useToast();

  // FETCH DATA
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const empData = await employeeService.getAll();
      const employeeList = Array.isArray(empData)
        ? empData
        : Array.isArray(empData?.data)
        ? empData.data
        : empData?.content || [];
      setEmployees(employeeList);

      let employeeId = user?.id;
      if (isEmployee && !employeeId && user?.email) {
        const matchedEmp = employeeList.find((e) => e.email === user.email);
        employeeId = matchedEmp?.id;
      }

      let leaveList = [];

      if (isEmployee && employeeId) {
        const myLeaves = await leaveService.getByEmployee(employeeId);
        leaveList = Array.isArray(myLeaves)
          ? myLeaves
          : Array.isArray(myLeaves?.data)
          ? myLeaves.data
          : myLeaves?.content || [];
      }

      if (isAdminOrHR) {
        const allLeaves = await leaveService.getAll();
        leaveList = Array.isArray(allLeaves)
          ? allLeaves
          : Array.isArray(allLeaves?.data)
          ? allLeaves.data
          : allLeaves?.content || [];
      }

      setLeaves(leaveList);
    } catch (err) {
      console.error(err);
      setError('Failed to load leave data. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // HELPERS
  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => String(e.id) === String(employeeId));
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Staff';
  };

  const formatDateRange = (start, end) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const s = new Date(start).toLocaleDateString(undefined, options);
    const e = new Date(end).toLocaleDateString(undefined, options);
    return s === e ? s : `${s} - ${e}`;
  };

  const calculateDays = (start, end) => {
    const diff = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  // ACTIONS
  const handleApprove = async (leaveId) => {
    setActionLoading(leaveId);
    try {
      await leaveService.approve(leaveId);
      toast({ title: 'Leave Approved', description: 'Leave request approved successfully.' });
      await fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Approval Failed', description: 'Failed to approve leave.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (leaveId) => {
    setActionLoading(leaveId);
    try {
      await leaveService.reject(leaveId, 'Rejected by Administrator');
      toast({ title: 'Leave Rejected', description: 'Leave request rejected.' });
      await fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Reject Failed', description: 'Failed to reject leave.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ UPDATED HERE (only change applied)
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await leaveService.applyLeave({
        ...formData,
        employeeId: user.id,
        startDate: formData.from,
        endDate: formData.to
      });

      setApplyOpen(false);
      setFormData({ leaveType: '', from: '', to: '', reason: '' });
      toast({ title: 'Leave Applied', description: 'Your request has been submitted for approval.' });
      fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to apply leave.', variant: 'destructive' });
    }
  };

  // FILTERS / STATS
  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING');
  const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED');
  const rejectedLeaves = leaves.filter((l) => l.status === 'REJECTED');

  if (loading) return <LoadingOverlay text="Accessing Leave Registry..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} variant="page" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEmployee ? 'Apply Leave' : 'Leave Management'}
        subtitle={
          isEmployee
            ? 'Submit and track your leave requests'
            : 'Approve or review employee time-off requests'
        }
        actions={
          isEmployee ? (
            <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Leave
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleApplyLeave} className="space-y-4 pt-4">
                  <div>
                    <Label>Leave Type</Label>
                    <Select value={formData.leaveType} onValueChange={(val) => setFormData({ ...formData, leaveType: val })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="personal">Personal Leave</SelectItem>
                        <SelectItem value="wfh">Work From Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>From</Label>
                      <Input
                        type="date"
                        required
                        className="mt-1.5"
                        value={formData.from}
                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>To</Label>
                      <Input
                        type="date"
                        required
                        className="mt-1.5"
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Reason</Label>
                    <Textarea
                      required
                      className="mt-1.5"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">Submit Request</Button>
                </form>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Pending" count={pendingLeaves.length} variant="warning" />
        <StatCard title="Approved" count={approvedLeaves.length} variant="success" />
        <StatCard title="Rejected" count={rejectedLeaves.length} variant="destructive" />
      </div>

      {!isEmployee && (
        <Tabs defaultValue="all">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            <TabsContent value="all">
              <LeaveTable leaves={leaves} getEmployeeName={getEmployeeName} formatDateRange={formatDateRange} calculateDays={calculateDays} onApprove={handleApprove} onReject={handleReject} actionLoading={actionLoading} />
            </TabsContent>
            <TabsContent value="pending">
              <LeaveTable leaves={pendingLeaves} getEmployeeName={getEmployeeName} formatDateRange={formatDateRange} calculateDays={calculateDays} onApprove={handleApprove} onReject={handleReject} actionLoading={actionLoading} />
            </TabsContent>
            <TabsContent value="approved">
              <LeaveTable leaves={approvedLeaves} getEmployeeName={getEmployeeName} formatDateRange={formatDateRange} calculateDays={calculateDays} onApprove={handleApprove} onReject={handleReject} actionLoading={actionLoading} />
            </TabsContent>
          </div>
        </Tabs>
      )}

      {isEmployee && (
        <LeaveTable
          leaves={leaves}
          getEmployeeName={getEmployeeName}
          formatDateRange={formatDateRange}
          calculateDays={calculateDays}
        />
      )}
    </div>
  );
};

const LeaveTable = ({ leaves, getEmployeeName, formatDateRange, calculateDays, onApprove, onReject, actionLoading }) => (
  <Card>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
            {onApprove && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {leaves.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32">
                <EmptyState title="No records found" icon={Calendar} />
              </TableCell>
            </TableRow>
          ) : (
            leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{getEmployeeName(leave.employeeId)}</TableCell>
                <TableCell>{leave.leaveType || 'Leave'}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDateRange(leave.startDate, leave.endDate)}
                </TableCell>
                <TableCell>{calculateDays(leave.startDate, leave.endDate)}d</TableCell>
                <TableCell>
                  <StatusBadge status={leave.status} variant="leave" />
                </TableCell>
                {onApprove && leave.status === 'PENDING' && (
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" className="text-green-600" disabled={actionLoading === leave.id} onClick={() => onApprove(leave.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600" disabled={actionLoading === leave.id} onClick={() => onReject(leave.id)}>
                      <X className="w-4 h-4" />
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
);

const StatCard = ({ title, count, variant }) => (
  <Card className={`border-none shadow-sm bg-${variant}/5`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-xs font-semibold uppercase tracking-wider">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className={`text-3xl font-bold text-${variant}`}>{count}</p>
    </CardContent>
  </Card>
);

export default LeaveManagementPage;