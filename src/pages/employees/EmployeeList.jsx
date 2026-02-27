import React, { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import { PageHeader, EmptyState, LoadingOverlay, ErrorState } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { employeeService } from '@/api';
import { useAuthStore } from '@/stores/authStore';

const Employees = () => {
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', department: '', designation: '', phone: '' });
  const { toast } = useToast();

  // Fetch Employees
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.getAll(); // Fixed API call
      const data = response.data;

      const list =
        Array.isArray(data) ? data :
        Array.isArray(data?.content) ? data.content :
        Array.isArray(data?.data) ? data.data :
        Array.isArray(data?._embedded?.employees) ? data._embedded.employees :
        [];

      setEmployees(list);

    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError('Failed to fetch employees. Please check your API or network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  // Add or Update Employee
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee({ ...formData, id: editingEmployee.id });
        toast({ title: "Employee updated", description: "Employee record has been updated." });
      } else {
        await employeeService.createEmployee(formData);
        toast({ title: "Employee added", description: "New employee has been created." });
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      setFormData({ firstName: '', lastName: '', email: '', department: '', designation: '', phone: '' });
      fetchEmployees();
    } catch (err) {
      toast({ title: "Error", description: "Email is required and must be unique.", variant: "destructive" });
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployees();
        toast({ title: "Deleted", description: "Employee record deleted." });
      } catch {
        toast({ title: "Error", description: "Failed to delete employee.", variant: "destructive" });
      }
    }
  };

  // Edit Employee
  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
      phone: emp.phone || '',
    });
    setIsModalOpen(true);
  };

  // Filters + Search
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const searchLower = searchQuery.trim().toLowerCase();
      if (searchLower && !((emp.firstName || "").toLowerCase().includes(searchLower) || (emp.lastName || "").toLowerCase().includes(searchLower) || (emp.email || "").toLowerCase().includes(searchLower))) return false;
      if (deptFilter !== 'all' && emp.department !== deptFilter) return false;
      return true;
    });
  }, [employees, searchQuery, deptFilter]);

  // Group Employees by Departments
  const departmentGroups = useMemo(() => {
    const map = { HR: 0, Finance: 0, IT: 0, Operations: 0, Marketing: 0 };
    employees.forEach(emp => {
      const dept = (emp.department || '').toLowerCase();
      if (dept.includes('hr')) map.HR++;
      else if (dept.includes('finance')) map.Finance++;
      else if (dept.includes('it')) map.IT++;
      else if (dept.includes('operations')) map.Operations++;
      else if (dept.includes('marketing')) map.Marketing++;
    });
    return map;
  }, [employees]);

  if (loading) return <LoadingOverlay text="Accessing HRIS Records..." />;
  if (error) return <ErrorState message={error} onRetry={fetchEmployees} variant="page" />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Employee Directory"
        subtitle="Manage your organization's workforce"
        actions={isAdmin && (
          <Button className="gap-2" onClick={() => { setEditingEmployee(null); setFormData({ firstName: '', lastName: '', email: '', department: '', designation: '', phone: '' }); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        )}
      />

      {/* Department Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="HR" value={departmentGroups.HR} color="info" />
        <StatCard label="Finance" value={departmentGroups.Finance} color="success" />
        <StatCard label="IT" value={departmentGroups.IT} color="warning" />
        <StatCard label="Operations" value={departmentGroups.Operations} color="destructive" />
        <StatCard label="Marketing" value={departmentGroups.Marketing} color="blue" />
      </div>

      <Card>
        <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {[...new Set(employees.map(e => e.department).filter(Boolean))].map(dep => (
                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredEmployees.length === 0 ? (
        <EmptyState icon={Users} title="No employees found" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map(emp => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.firstName} {emp.lastName}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.department || 'General'}</TableCell>
                    <TableCell>{emp.designation || 'General'}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)}><Edit size={16}/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)} className="text-red-500">
                          <Trash2 size={16}/>
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ADD / EDIT EMPLOYEE DIALOG */}
      {isAdmin && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email (Required)</Label>
                <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingEmployee(null); }}>Cancel</Button>
                <Button type="submit">{editingEmployee ? "Update" : "Save"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Stat Card Component
const colorStyles = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  destructive: 'bg-red-50 text-red-700 border-red-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
  blue: 'bg-sky-50 text-sky-700 border-sky-100',
};

const StatCard = ({ label, value, color }) => (
  <div className={`rounded-xl border p-4 shadow-sm ${colorStyles[color]}`}>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs font-medium uppercase tracking-wider opacity-80">{label}</p>
  </div>
);

export default Employees;
