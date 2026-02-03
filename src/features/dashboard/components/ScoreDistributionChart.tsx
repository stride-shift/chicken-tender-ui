import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { PieLabelRenderProps } from 'recharts'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { PixelBox } from '@/components/ui'

const COLORS = {
  excellent: '#10b981',
  good: '#3b82f6',
  review: '#f59e0b',
}

interface ChartData {
  name: string
  value: number
  color: string
}

export function ScoreDistributionChart() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <PixelBox color="#2d8f8f" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500" />
            <span className="text-xs tracking-widest font-black text-teal-600">SCORE DISTRIBUTION</span>
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
      <PixelBox color="#2d8f8f" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500" />
            <span className="text-xs tracking-widest font-black text-teal-600">SCORE DISTRIBUTION</span>
          </div>
        </div>
        <div className="p-4 bg-stone-50">
          <div className="bg-red-50 border-2 border-red-400 text-red-600 px-4 py-3">
            <p className="text-sm font-mono">{(error as Error).message}</p>
          </div>
        </div>
      </PixelBox>
    )
  }

  const total =
    (stats?.excellent_count ?? 0) +
    (stats?.good_count ?? 0) +
    (stats?.worth_reviewing_count ?? 0)

  const chartData: ChartData[] = [
    { name: 'Excellent Fit', value: stats?.excellent_count ?? 0, color: COLORS.excellent },
    { name: 'Good Fit', value: stats?.good_count ?? 0, color: COLORS.good },
    { name: 'Worth Reviewing', value: stats?.worth_reviewing_count ?? 0, color: COLORS.review },
  ].filter((item) => item.value > 0)

  if (total === 0) {
    return (
      <PixelBox color="#2d8f8f" bgColor="#ffffff">
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500" />
            <span className="text-xs tracking-widest font-black text-teal-600">SCORE DISTRIBUTION</span>
          </div>
        </div>
        <div className="h-56 flex items-center justify-center bg-stone-50 text-stone-500">
          <p className="font-mono text-sm">NO RELEVANT TENDERS</p>
        </div>
      </PixelBox>
    )
  }

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
    if (
      typeof cx !== 'number' ||
      typeof cy !== 'number' ||
      typeof midAngle !== 'number' ||
      typeof innerRadius !== 'number' ||
      typeof outerRadius !== 'number' ||
      typeof percent !== 'number' ||
      percent < 0.05
    ) {
      return null
    }

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-black font-mono"
        style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0]
    const percentage = ((data.value / total) * 100).toFixed(1)

    return (
      <div className="bg-white border-2 border-teal-500 px-3 py-2" style={{ boxShadow: '4px 4px 0 rgba(45, 143, 143, 0.3)' }}>
        <p className="text-sm font-black text-teal-700 font-mono">{data.name}</p>
        <p className="text-sm text-stone-600 font-mono">
          {data.value} tender{data.value !== 1 ? 's' : ''} ({percentage}%)
        </p>
      </div>
    )
  }

  return (
    <PixelBox color="#2d8f8f" bgColor="#ffffff">
      {/* Header - light */}
      <div className="p-4 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500" />
          <span className="text-xs tracking-widest font-black text-teal-600">SCORE DISTRIBUTION</span>
        </div>
        <div className="text-stone-500 text-sm mt-1 font-mono">{total} relevant tenders</div>
      </div>

      {/* Chart area - light background */}
      <div className="relative bg-stone-50 p-6">
        <div className="h-48 relative z-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                stroke="#f5f5f4"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="text-3xl font-black font-mono text-teal-600">{total}</span>
              <div className="text-stone-500 text-xs font-mono mt-1">TOTAL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend - light */}
      <div className="p-4 bg-stone-50 flex flex-wrap justify-center gap-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3"
              style={{
                backgroundColor: item.color,
              }}
            />
            <span className="text-stone-600 text-xs font-mono">
              {item.name}: <span className="text-stone-800 font-bold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </PixelBox>
  )
}
