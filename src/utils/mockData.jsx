export const DEMO_USERS = [
  { id: "1", name: "Sarah Chen", email: "admin@hris.com", role: "ADMIN", department: "Management", position: "System Administrator" },
  { id: "2", name: "James Wilson", email: "hr@hris.com", role: "HR", department: "Human Resources", position: "HR Manager" },
  { id: "3", name: "Emily Parker", email: "employee@hris.com", role: "EMPLOYEE", department: "Engineering", position: "Software Engineer" },
];

export const EMPLOYEES = [
  { id: "1", name: "Sarah Chen", email: "sarah@hris.com", department: "Management", position: "CTO", status: "Active", joinDate: "2020-01-15", phone: "+1 555-0101" },
  { id: "2", name: "James Wilson", email: "james@hris.com", department: "Human Resources", position: "HR Manager", status: "Active", joinDate: "2020-03-20", phone: "+1 555-0102" },
  { id: "3", name: "Emily Parker", email: "emily@hris.com", department: "Engineering", position: "Software Engineer", status: "Active", joinDate: "2021-06-10", phone: "+1 555-0103" },
  { id: "4", name: "Michael Brown", email: "michael@hris.com", department: "Engineering", position: "Senior Developer", status: "Active", joinDate: "2021-08-01", phone: "+1 555-0104" },
  { id: "5", name: "Lisa Anderson", email: "lisa@hris.com", department: "Marketing", position: "Marketing Lead", status: "Active", joinDate: "2022-01-05", phone: "+1 555-0105" },
  { id: "6", name: "David Kim", email: "david@hris.com", department: "Finance", position: "Financial Analyst", status: "On Leave", joinDate: "2022-04-15", phone: "+1 555-0106" },
  { id: "7", name: "Rachel Green", email: "rachel@hris.com", department: "Design", position: "UI/UX Designer", status: "Active", joinDate: "2022-07-20", phone: "+1 555-0107" },
  { id: "8", name: "Tom Harris", email: "tom@hris.com", department: "Engineering", position: "DevOps Engineer", status: "Active", joinDate: "2023-02-10", phone: "+1 555-0108" },
  { id: "9", name: "Anna Martinez", email: "anna@hris.com", department: "Sales", position: "Sales Executive", status: "Inactive", joinDate: "2021-11-30", phone: "+1 555-0109" },
  { id: "10", name: "Chris Taylor", email: "chris@hris.com", department: "Engineering", position: "QA Engineer", status: "Active", joinDate: "2023-05-15", phone: "+1 555-0110" },
];

export const DEPARTMENTS = ["Engineering", "Human Resources", "Marketing", "Finance", "Design", "Sales", "Management"];

export const LEAVE_REQUESTS = [
  { id: "1", employee: "Emily Parker", type: "Annual Leave", from: "2026-02-15", to: "2026-02-19", days: 5, status: "Pending", reason: "Family vacation" },
  { id: "2", employee: "Michael Brown", type: "Sick Leave", from: "2026-02-10", to: "2026-02-11", days: 2, status: "Approved", reason: "Medical appointment" },
  { id: "3", employee: "Lisa Anderson", type: "Annual Leave", from: "2026-02-20", to: "2026-02-25", days: 4, status: "Pending", reason: "Personal travel" },
  { id: "4", employee: "Tom Harris", type: "Work From Home", from: "2026-02-12", to: "2026-02-12", days: 1, status: "Approved", reason: "Home maintenance" },
  { id: "5", employee: "Rachel Green", type: "Sick Leave", from: "2026-02-08", to: "2026-02-09", days: 2, status: "Rejected", reason: "Feeling unwell" },
];

export const ATTENDANCE_DATA = [
  { date: "Mon", present: 45, absent: 3, late: 2 },
  { date: "Tue", present: 47, absent: 2, late: 1 },
  { date: "Wed", present: 44, absent: 4, late: 2 },
  { date: "Thu", present: 46, absent: 3, late: 1 },
  { date: "Fri", present: 43, absent: 5, late: 2 },
];

export const DEPARTMENT_DISTRIBUTION = [
  { name: "Engineering", value: 18, fill: "hsl(var(--chart-1))" },
  { name: "Marketing", value: 8, fill: "hsl(var(--chart-2))" },
  { name: "Finance", value: 6, fill: "hsl(var(--chart-3))" },
  { name: "HR", value: 5, fill: "hsl(var(--chart-4))" },
  { name: "Design", value: 4, fill: "hsl(var(--chart-5))" },
  { name: "Sales", value: 7, fill: "hsl(var(--warning))" },
];

export const MONTHLY_GROWTH = [
  { month: "Sep", employees: 38 },
  { month: "Oct", employees: 40 },
  { month: "Nov", employees: 42 },
  { month: "Dec", employees: 44 },
  { month: "Jan", employees: 47 },
  { month: "Feb", employees: 50 },
];

export const PERFORMANCE_DATA = [
  { name: "Emily Parker", department: "Engineering", rating: 4.5, status: "Excellent", lastReview: "2026-01-15" },
  { name: "Michael Brown", department: "Engineering", rating: 4.2, status: "Good", lastReview: "2026-01-15" },
  { name: "Lisa Anderson", department: "Marketing", rating: 3.8, status: "Good", lastReview: "2026-01-20" },
  { name: "David Kim", department: "Finance", rating: 4.0, status: "Good", lastReview: "2026-01-10" },
  { name: "Rachel Green", department: "Design", rating: 4.7, status: "Excellent", lastReview: "2026-01-18" },
  { name: "Tom Harris", department: "Engineering", rating: 3.5, status: "Average", lastReview: "2026-01-22" },
  { name: "Chris Taylor", department: "Engineering", rating: 4.1, status: "Good", lastReview: "2026-01-25" },
];

export const RECENT_ACTIVITIES = [
  { id: "1", action: "New employee onboarded", detail: "Chris Taylor joined Engineering", time: "2 hours ago", type: "success" },
  { id: "2", action: "Leave request submitted", detail: "Emily Parker requested 5 days annual leave", time: "3 hours ago", type: "info" },
  { id: "3", action: "Performance review completed", detail: "Rachel Green scored 4.7/5.0", time: "5 hours ago", type: "success" },
  { id: "4", action: "Attendance alert", detail: "3 employees marked absent today", time: "6 hours ago", type: "warning" },
  { id: "5", action: "Leave request rejected", detail: "Rachel Green's sick leave was rejected", time: "1 day ago", type: "destructive" },
];
 