import React from "react";
import {
  Users,
  CalendarCheck,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import { KPICard } from "@/components/common/KPICard";
import { ActivityFeed } from "@/components/common/ActivityFeed";

import {
  ATTENDANCE_DATA,
  DEPARTMENT_DISTRIBUTION,
  MONTHLY_GROWTH,
  RECENT_ACTIVITIES,
} from "@/utils/mockData";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  
  // KPI data (easy to connect backend later)
  const KPIData = [
    {
      icon: Users,
      title: "Total Employees",
      value: 50,
      change: "+6% from last month",
      changeType: "positive",
    },
    {
      icon: CalendarCheck,
      title: "Present Today",
      value: 45,
      change: "90% attendance",
      changeType: "positive",
    },
    {
      icon: CalendarDays,
      title: "Leave Requests",
      value: 3,
      change: "2 pending approval",
      changeType: "neutral",
    },
    {
      icon: TrendingUp,
      title: "Avg. Performance",
      value: "4.1",
      change: "+0.3 from last quarter",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* KPI CARDS  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIData.map((item, index) => (
          <KPICard key={index} {...item} />
        ))}
      </div>

      {/* CHART ROW  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Weekly Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Weekly Attendance
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ATTENDANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="present" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Departments
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
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
                  {DEPARTMENT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ================= GROWTH + ACTIVITY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Employee Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Employee Growth
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ActivityFeed activities={RECENT_ACTIVITIES} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
