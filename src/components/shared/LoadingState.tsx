interface LoadingStateProps {
  variant?: 'card' | 'list' | 'detail' | 'page';
  count?: number;
  message?: string;
}

export function LoadingState({ message = 'LOADING...' }: LoadingStateProps) {
  // All variants now use the arcade loading animation
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="flex gap-1 mb-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-4 h-8 bg-teal-500 rounded-sm"
            style={{
              animation: `pulse 1s ease-in-out ${i * 0.1}s infinite`,
              boxShadow: '0 0 10px #2d8f8f66'
            }}
          />
        ))}
      </div>
      <div
        className="font-mono font-black text-teal-500 tracking-widest"
        style={{ textShadow: '0 0 10px #2d8f8f' }}
      >
        {message}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
