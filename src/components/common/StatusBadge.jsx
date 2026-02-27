import { cn } from '@/lib/utils';

const statusMap = {
  // Leave module
  PENDING: "pending",
  APPROVED: "success",
  REJECTED: "error",

  // Attendance module
  PRESENT: "success",
  LEAVE: "warning",
  WFH: "info",

  COMPLETED: "success",
  IN_PROGRESS: "info",
  PENDING_REVIEW: "pending"
};

const statusClasses = {
  success: 'status-badge-success',
  warning: 'status-badge-warning',
  error: 'status-badge-error',
  info: 'status-badge-info',
  pending: 'status-badge-pending',
};

export function StatusBadge({ status, label, className }) {
  // Normalize input status: trim spaces and uppercase
  const normalizedStatus = status?.toString().trim().toUpperCase();

  // Map normalized status to internal status value
  const mappedStatus = statusMap[normalizedStatus] || normalizedStatus?.toLowerCase() || 'pending';

  return (
    <span className={cn('status-badge', statusClasses[mappedStatus], className)}>
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          mappedStatus === 'success' && "bg-success",
          mappedStatus === 'warning' && "bg-warning",
          mappedStatus === 'error' && "bg-destructive",
          mappedStatus === 'info' && "bg-info",
          mappedStatus === 'pending' && "bg-muted-foreground"
        )}
      />
      {label || status}
    </span>
  );
}

