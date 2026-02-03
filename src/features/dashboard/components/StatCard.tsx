import { LEDNumber } from '@/components/ui';

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
  bgColor?: string;
}

/**
 * Arcade-style stat display with LED numbers and pixel corner accents.
 * Used in the dashboard stats row for key metrics.
 */
export function StatCard({ label, value, color = '#2d8f8f', bgColor = '#f0fdfa' }: StatCardProps) {
  return (
    <div
      className="relative p-5 text-center"
      style={{ backgroundColor: bgColor }}
    >
      {/* Pixel corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2" style={{ backgroundColor: color }} />
      <div className="absolute top-0 right-0 w-2 h-2" style={{ backgroundColor: color }} />
      <div className="absolute bottom-0 left-0 w-2 h-2" style={{ backgroundColor: color }} />
      <div className="absolute bottom-0 right-0 w-2 h-2" style={{ backgroundColor: color }} />

      <LEDNumber value={value} color={color} size="medium" />
      <div className="text-stone-500 text-xs tracking-widest mt-2 font-bold uppercase">
        {label}
      </div>
    </div>
  );
}
