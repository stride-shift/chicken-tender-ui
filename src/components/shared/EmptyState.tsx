import { PixelBox } from '@/components/ui';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'NO DATA FOUND',
  message = 'Insert coin to continue...',
}: EmptyStateProps) {
  return (
    <PixelBox color="#64748b" className="p-8 text-center">
      <div className="text-6xl mb-4">🎮</div>
      <div
        className="font-mono font-black text-xl text-stone-400 tracking-widest mb-2"
        style={{ textShadow: '2px 2px 0 #1a1a1a' }}
      >
        {title}
      </div>
      <div className="text-stone-500 text-sm font-mono">
        {message}
      </div>
    </PixelBox>
  );
}
