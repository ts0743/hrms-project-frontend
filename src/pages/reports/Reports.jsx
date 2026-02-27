import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTHLY_GROWTH, DEPARTMENT_DISTRIBUTION, ATTENDANCE_DATA } from "@/utils/mockData";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { useAuthStore } from "@/stores/authStore";

export default function Reports() {
  const user = useAuthStore((s) => s.user);
  const isEmployee = user?.role === "EMPLOYEE";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Reports</h2>
        <p className="page-description">Organization analytics and reporting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Headcount Growth */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Headcount Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={MONTHLY_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="employees" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Department Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={DEPARTMENT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DEPARTMENT_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Trends */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Attendance Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ATTENDANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
