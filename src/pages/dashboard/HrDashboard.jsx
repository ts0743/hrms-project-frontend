import React from "react";
import { Users, CalendarDays, CalendarCheck, Building } from "lucide-react";

import { KpiCard as KPICard } from "@/components/common/KPICard";
import { ActivityFeed } from "@/components/common/ActivityFeed";

import {
  ATTENDANCE_DATA,
  DEPARTMENT_DISTRIBUTION,
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
  Legend,
} from "recharts";

export default function HRDashboard() {
  
  // KPI data → easy backend connection later
  const kPIData = [
    {
      icon: Users,
      title: "Employee Count",
      value: 50,
      change: "+3 this month",
      changeType: "positive",
    },
    {
      icon: CalendarDays,
      title: "Pending Leaves",
      value: 2,
      change: "Requires approval",
      changeType: "neutral",
    },
    {
      icon: CalendarCheck,
      title: "Attendance Today",
      value: "90%",
      change: "45 of 50 present",
      changeType: "positive",
    },
    {
      icon: Building,
      title: "Departments",
      value: 6,
      change: "All active",
      changeType: "neutral",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kPIData.map((item, index) => (
          <KPICard key={index} {...item} />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Attendance Overview
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ATTENDANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Department Stats
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
                  {DEPARTMENT_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* RECENT ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Recent Actions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ActivityFeed activities={RECENT_ACTIVITIES} />
        </CardContent>
      </Card>

    </div>
  );
}
