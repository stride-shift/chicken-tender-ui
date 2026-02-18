interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'No data found',
  message = 'There are no items to display.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-subtitle font-sans font-semibold text-foreground mb-2">
        {title}
      </div>
      <div className="text-muted-foreground text-sm">
        {message}
      </div>
    </div>
  );
}
