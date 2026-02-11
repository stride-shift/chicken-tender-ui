interface LoadingStateProps {
  variant?: 'card' | 'list' | 'detail' | 'page';
  count?: number;
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <div className="text-muted-foreground text-sm">
        {message}
      </div>
    </div>
  );
}
