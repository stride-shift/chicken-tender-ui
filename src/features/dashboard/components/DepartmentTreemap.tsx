import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { useFilterOptions } from '@/features/tenders/hooks/useFilterOptions'
import { PixelBox } from '@/components/ui'

// Muted, professional color palette that fits the app's style
const DEPARTMENT_COLORS = [
  '#2a9d8f', // teal (primary)
  '#457b9d', // steel blue
  '#6b7280', // gray
  '#e76f51', // coral (accent)
  '#8b5cf6', // violet
  '#059669', // emerald
  '#0891b2', // cyan
  '#d97706', // amber
  '#7c3aed', // purple
  '#dc2626', // red
  '#2563eb', // blue
  '#65a30d', // lime
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
  const color = DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]
  const showLabel = width > 55 && height > 35
  const showValue = width > 45 && height > 45
  const gap = 3

  // Truncate name based on available width
  const getDisplayName = () => {
    const maxChars = Math.floor((width - 16) / 7)
    if (name.length <= maxChars) return name
    return name.substring(0, Math.max(3, maxChars - 3)) + '...'
  }

  return (
    <g>
      {/* Cell with border */}
      <rect
        x={x + gap}
        y={y + gap}
        width={Math.max(0, width - gap * 2)}
        height={Math.max(0, height - gap * 2)}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2}
        rx={4}
        className="transition-all duration-150 hover:brightness-110"
      />
      {/* Name label */}
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showValue ? 7 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize={10}
          fontWeight="600"
          fontFamily="system-ui, sans-serif"
          className="pointer-events-none select-none"
        >
          {getDisplayName()}
        </text>
      )}
      {/* Value label */}
      {showValue && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.9)"
          fontSize={13}
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          className="pointer-events-none select-none"
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
    <div
      className="bg-white px-3 py-2 rounded shadow-lg"
      style={{ border: '2px solid #2a9d8f' }}
    >
      <p className="text-sm font-semibold text-stone-800">{data.name}</p>
      <p className="text-sm text-stone-600">
        <span className="font-bold text-teal-600">{data.value}</span> tender{data.value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export function DepartmentTreemap() {
  const { departments, isLoading, error } = useFilterOptions()

  if (isLoading) {
    return (
      <PixelBox color="#2a9d8f" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500" />
            <span className="text-xs tracking-widest font-black text-teal-600">TENDERS BY DEPARTMENT</span>
          </div>
        </div>
        <div className="h-56 flex items-center justify-center bg-stone-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-teal-500" />
        </div>
      </PixelBox>
    )
  }

  if (error) {
    return (
      <PixelBox color="#2a9d8f" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500" />
            <span className="text-xs tracking-widest font-black text-teal-600">TENDERS BY DEPARTMENT</span>
          </div>
        </div>
        <div className="p-4 bg-stone-50">
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded">
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
      <PixelBox color="#2a9d8f" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500" />
            <span className="text-xs tracking-widest font-black text-teal-600">TENDERS BY DEPARTMENT</span>
          </div>
        </div>
        <div className="h-56 flex items-center justify-center bg-stone-50 text-stone-500">
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
    <PixelBox color="#2a9d8f" bgColor="#ffffff">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500" />
          <span className="text-xs tracking-widest font-black text-teal-600">TENDERS BY DEPARTMENT</span>
        </div>
        <div className="text-stone-500 text-sm mt-1 font-mono">
          {total} tender{total !== 1 ? 's' : ''} across {sortedDepartments.length} department{sortedDepartments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Treemap area */}
      <div className="bg-stone-100 p-3">
        <div
          className="h-56 rounded overflow-hidden"
          style={{ backgroundColor: '#e7e5e4' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="value"
              nameKey="name"
              content={<TreemapContent x={0} y={0} width={0} height={0} index={0} name="" value={0} />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </PixelBox>
  )
}
