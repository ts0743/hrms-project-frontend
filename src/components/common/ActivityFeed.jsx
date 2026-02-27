import { cn } from "@/lib/utils";

export function ActivityFeed({ activities }) {
  const dotColors = {
    success: "bg-success",
    info: "bg-info",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <div className="space-y-4">
      {activities.map((a) => (
        <div key={a.id} className="flex gap-3">
          <div className="mt-1.5">
            <div className={cn("w-2.5 h-2.5 rounded-full", dotColors[a.type])} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{a.action}</p>
            <p className="text-xs text-muted-foreground truncate">{a.detail}</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
