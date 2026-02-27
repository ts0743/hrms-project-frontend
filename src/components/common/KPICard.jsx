import React from "react";

export function KPICard({
  icon: Icon,
  title = "KPI Title",
  value = 0,
  change = "",
  changeType = "neutral",
}) {
  const changeColor =
    changeType === "positive"
      ? "text-green-500"
      : changeType === "negative"
      ? "text-red-500"
      : "text-gray-500";

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-blue-500" />}
      </div>

      <h2 className="text-2xl font-bold mt-2">{value}</h2>

      {change && (
        <p className={`text-xs mt-1 ${changeColor}`}>
          {change}
        </p>
      )}
    </div>
  );
}

