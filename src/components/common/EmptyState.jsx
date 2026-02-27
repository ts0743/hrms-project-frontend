import { Button } from '@/components/ui/button';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="empty-state">
      <Icon className="empty-state-icon h-12 w-12" />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
