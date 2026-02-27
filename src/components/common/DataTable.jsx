import { Loader2 } from 'lucide-react';

export function DataTable({ 
  columns, 
  data, 
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  emptyIcon
}) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading data...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="empty-state">
        {emptyIcon && <div className="empty-state-icon">{emptyIcon}</div>}
        <p className="empty-state-title">{emptyMessage}</p>
        <p className="empty-state-description">Try adjusting your filters or add new entries.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={column.className}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="animate-fade-in">
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render 
                      ? column.render(item) 
                      : item[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
