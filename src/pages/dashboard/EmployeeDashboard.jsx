import React from "react";
import {
  CalendarCheck,
  CalendarDays,
  TrendingUp,
  Clock,
} from "lucide-react";

import { KPICard } from "@/components/common/KPICard";
import { ActivityFeed } from "@/components/common/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/* ----------------------------- STATIC DATA ----------------------------- */

const KPI_DATA = [
  {
    icon: CalendarCheck,
    title: "Attendance Rate",
    value: "96%",
    change: 2,
    changeLabel: "vs last month",
  },
  {
    icon: CalendarDays,
    title: "Leave Balance",
    value: 15,
    change: 0,
    changeLabel: "Annual leave remaining",
  },
  {
    icon: Clock,
    title: "Hours This Week",
    value: "38.5h",
    change: -1.5,
    changeLabel: "vs target",
  },
  {
    icon: TrendingUp,
    title: "Performance Score",
    value: "4.5",
    change: 5,
    changeLabel: "vs last quarter",
  },
];

const MY_LEAVES = [
  { type: "Annual Leave", used: 5, total: 20 },
  { type: "Sick Leave", used: 2, total: 10 },
  { type: "Personal Leave", used: 1, total: 5 },
];

const MY_ACTIVITIES = [
  {
    id: "1",
    action: "Attendance marked",
    detail: "Checked in at 9:02 AM",
    time: "Today",
    type: "success",
  },
  {
    id: "2",
    action: "Leave applied",
    detail: "Annual leave: Feb 15-19",
    time: "Yesterday",
    type: "info",
  },
];

/* ----------------------------- HELPERS ----------------------------- */

const calculatePercentage = (used, total) =>
  Math.round((used / total) * 100);

/* ----------------------------- COMPONENT ----------------------------- */

export default function EmployeeDashboard() {
  return (
    <div className="relative space-y-10 animate-in fade-in duration-700">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your performance, attendance, and activities
          </p>
        </div>

        {/* Quick Status Badge */}
        <div className="px-4 py-2 rounded-xl bg-primary/10 border text-sm font-medium">
          Active Employee
        </div>
      </div>

      {/* KPI Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {KPI_DATA.map((item) => (
            <div
              key={item.title}
              className="transition-all duration-300 hover:scale-[1.03]"
            >
              <KPICard {...item} />
            </div>
          ))}
        </div>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">

          {/* Leave Balance */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Leave Balance
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Overview of your leave usage
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {MY_LEAVES.map((leave) => {
                const percent = calculatePercentage(
                  leave.used,
                  leave.total
                );

                return (
                  <div
                    key={leave.type}
                    className="p-4 rounded-xl border bg-background/50 hover:bg-muted/40 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {leave.type}
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {leave.used}/{leave.total}
                        </span>

                        <span className="text-xs font-semibold">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    <Progress value={percent} className="h-2 rounded-full" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Recent Activity
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your latest actions and updates
              </p>
            </CardHeader>

            <CardContent>
              <ActivityFeed activities={MY_ACTIVITIES} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — QUICK INSIGHTS */}
        <div className="space-y-6">

          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-blue-400/5 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Insights</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Leave Types Used
                </span>
                <span className="font-semibold">
                  {MY_LEAVES.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Activities Logged
                </span>
                <span className="font-semibold">
                  {MY_ACTIVITIES.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Avg Leave Usage
                </span>
                <span className="font-semibold">
                  {Math.round(
                    MY_LEAVES.reduce(
                      (acc, l) => acc + calculatePercentage(l.used, l.total),
                      0
                    ) / MY_LEAVES.length
                  )}%
                </span>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}