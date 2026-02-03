import { PixelBox, ArcadeButton } from '@/components/ui';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'GAME OVER',
  message = 'Something went wrong',
  onRetry,
}: ErrorStateProps) {
  return (
    <PixelBox color="#ef4444" className="p-8 text-center">
      <div
        className="font-mono font-black text-4xl text-red-500 tracking-widest mb-4"
        style={{ textShadow: '0 0 20px #ef4444, 2px 2px 0 #7f1d1d' }}
      >
        {title}
      </div>
      <div className="text-red-400 mb-4 font-mono">{message}</div>
      {onRetry && (
        <ArcadeButton variant="danger" onClick={onRetry}>
          RETRY
        </ArcadeButton>
      )}
    </PixelBox>
  );
}
