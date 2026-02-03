import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { useFilterOptions } from '@/features/tenders/hooks/useFilterOptions'
import { PixelBox } from '@/components/ui'

// Arcade color palette for departments with gradients
const DEPARTMENT_COLORS = [
  { gradient: 'linear-gradient(135deg, #fb923c 0%, #c75d32 50%, #9a3412 100%)', solid: '#fb923c' },
  { gradient: 'linear-gradient(135deg, #4ecdc4 0%, #2d8f8f 100%)', solid: '#4ecdc4' },
  { gradient: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)', solid: '#c084fc' },
  { gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', solid: '#4ade80' },
  { gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', solid: '#60a5fa' },
  { gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)', solid: '#f472b6' },
  { gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', solid: '#fbbf24' },
  { gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)', solid: '#a78bfa' },
  { gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', solid: '#34d399' },
  { gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', solid: '#38bdf8' },
]

interface TreemapContentProps {
  x: number
  y: number
  width: number
  height: number
  index: number
  name: string
  value: number
}

function TreemapContent({ x, y, width, height, index, name, value }: TreemapContentProps) {
  const colorSet = DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]
  const showLabel = width > 60 && height > 40
  const showValue = width > 40 && height > 30
  const gradientId = `dept-gradient-${index}`

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorSet.solid} stopOpacity={1} />
          <stop offset="50%" stopColor={colorSet.solid} stopOpacity={0.8} />
          <stop offset="100%" stopColor={colorSet.solid} stopOpacity={0.6} />
        </linearGradient>
        <filter id={`glow-${index}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        fill={`url(#${gradientId})`}
        stroke="#0a0a0a"
        strokeWidth={2}
        className="transition-opacity hover:opacity-90"
        style={{ filter: `url(#glow-${index})` }}
      />
      {/* Scanline effect overlay */}
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        fill="url(#scanlinePattern)"
        opacity={0.1}
        className="pointer-events-none"
      />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showValue ? 8 : 0)}
          textAnchor="middle"
          fill="#fff"
          fontSize={width > 100 ? 11 : 9}
          fontWeight="900"
          fontFamily="monospace"
          className="pointer-events-none"
          style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
        >
          {name.length > 12 ? name.substring(0, 12) + '...' : name}
        </text>
      )}
      {showValue && showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          fill="rgba(255,255,255,0.95)"
          fontSize={14}
          fontWeight="900"
          fontFamily="monospace"
          className="pointer-events-none"
          style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
        >
          {value}
        </text>
      )}
    </g>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-stone-900 border-2 border-purple-500 px-3 py-2" style={{ boxShadow: '4px 4px 0 rgba(168, 85, 247, 0.3)' }}>
      <p className="text-sm font-black text-purple-400 font-mono">{data.name}</p>
      <p className="text-sm text-stone-300 font-mono">
        <span className="font-bold text-stone-100">{data.value}</span> tender{data.value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export function DepartmentTreemap() {
  const { departments, isLoading, error } = useFilterOptions()

  if (isLoading) {
    return (
      <PixelBox color="#a855f7" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500" />
            <span className="text-xs tracking-widest font-black text-purple-600">TENDERS BY DEPARTMENT</span>
          </div>
        </div>
        <div className="h-56 flex items-center justify-center bg-stone-100">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-purple-500" />
        </div>
      </PixelBox>
    )
  }

  if (error) {
    return (
      <PixelBox color="#a855f7" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500" />
            <span className="text-xs tracking-widest font-black text-purple-600">TENDERS BY DEPARTMENT</span>
          </div>
        </div>
        <div className="p-4 bg-stone-50">
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3">
            <p className="text-sm font-mono">{error.message}</p>
          </div>
        </div>
      </PixelBox>
    )
  }

  // Sort by count descending and take top departments
  const sortedDepartments = [...departments]
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  const total = sortedDepartments.reduce((sum, d) => sum + d.count, 0)

  if (sortedDepartments.length === 0) {
    return (
      <PixelBox color="#a855f7" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500" />
            <span className="text-xs tracking-widest font-black text-purple-600">TENDERS BY DEPARTMENT</span>
          </div>
        </div>
        <div className="h-56 flex items-center justify-center bg-stone-100 text-stone-500">
          <p className="font-mono text-sm">NO DEPARTMENT DATA</p>
        </div>
      </PixelBox>
    )
  }

  // Transform data for Recharts Treemap
  const treemapData = sortedDepartments.map((dept) => ({
    name: dept.name,
    value: dept.count,
  }))

  return (
    <PixelBox color="#a855f7" bgColor="#ffffff">
      {/* Header - light */}
      <div className="p-4 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500" />
          <span className="text-xs tracking-widest font-black text-purple-600">TENDERS BY DEPARTMENT</span>
        </div>
        <div className="text-stone-500 text-sm mt-1 font-mono">
          {total} tender{total !== 1 ? 's' : ''} across {sortedDepartments.length} department{sortedDepartments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Treemap area - light bg with colorful cells */}
      <div className="relative bg-stone-100 p-4">
        <div className="h-56 relative z-0">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="value"
              nameKey="name"
              content={<TreemapContent x={0} y={0} width={0} height={0} index={0} name="" value={0} />}
            >
              <defs>
                <pattern id="scanlinePattern" patternUnits="userSpaceOnUse" width="4" height="4">
                  <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </PixelBox>
  )
}
