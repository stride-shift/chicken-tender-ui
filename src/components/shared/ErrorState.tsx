interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Error',
  message = 'Something went wrong',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-subtitle font-sans font-semibold text-destructive mb-2">
        {title}
      </div>
      <div className="text-foreground mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
