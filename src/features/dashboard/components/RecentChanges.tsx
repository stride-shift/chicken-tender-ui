import { useDashboardStats } from '../hooks/useDashboardStats'
import { PixelBox, LEDNumber } from '@/components/ui'

/**
 * Displays a preview of recent high-importance changes in terminal log style.
 * Currently shows just the count; will integrate with activity feed in the future.
 */
export function RecentChanges() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <PixelBox color="#1a3a4a" bgColor="#ffffff" className="overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-white border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500" />
            <span className="text-xs tracking-widest font-black text-purple-600">RECENT CHANGES</span>
          </div>
        </div>
        {/* Loading state */}
        <div className="bg-stone-50 p-4">
          <div className="h-6 w-48 bg-stone-200 rounded animate-pulse mb-3" />
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
        </div>
      </PixelBox>
    )
  }

  if (error) {
    return (
      <PixelBox color="#1a3a4a" bgColor="#ffffff" className="overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-white border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500" />
            <span className="text-xs tracking-widest font-black text-purple-600">RECENT CHANGES</span>
          </div>
        </div>
        {/* Error state */}
        <div className="bg-stone-50 p-4 font-mono">
          <span className="text-red-600">[ERROR]</span>
          <span className="text-red-500 ml-2">{(error as Error).message}</span>
        </div>
      </PixelBox>
    )
  }

  const changesCount = stats?.high_importance_changes_24h ?? 0

  return (
    <PixelBox color="#1a3a4a" bgColor="#ffffff" className="overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-white border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500" />
          <span className="text-xs tracking-widest font-black text-purple-600">RECENT CHANGES</span>
        </div>
      </div>

      {/* Log content */}
      <div className="bg-stone-50 p-4 relative">
        <div className="relative z-10 font-mono">
          {changesCount > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-stone-500">[24H]</span>
              <span
                className="px-2 py-0.5 text-xs font-bold rounded"
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#d97706'
                }}
              >
                ALERT
              </span>
              <div className="flex items-center gap-2">
                <LEDNumber value={changesCount} color="#f59e0b" size="small" />
                <span className="text-stone-600 text-sm">
                  high-importance {changesCount === 1 ? 'change' : 'changes'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-stone-500">[24H]</span>
              <span
                className="px-2 py-0.5 text-xs font-bold rounded"
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#16a34a'
                }}
              >
                OK
              </span>
              <span className="text-stone-500 text-sm">
                No high-importance changes
              </span>
            </div>
          )}

          {/* Status line */}
          <div className="mt-3 text-xs text-stone-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Activity feed integration coming soon</span>
          </div>
        </div>
      </div>
    </PixelBox>
  )
}
