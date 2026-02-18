import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { PieLabelRenderProps } from 'recharts'
import { useDashboardStats } from '../hooks/useDashboardStats'

const COLORS = {
  excellent: '#22c55e',  // green-500 — excellent = green
  good: '#3b82f6',       // blue-500 — good = blue
  review: '#f59e0b',     // amber-500 — review = amber/orange
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
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-sans font-semibold text-foreground">Score Distribution</h3>
        </div>
        <div className="h-56 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-sans font-semibold text-foreground">Score Distribution</h3>
        </div>
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      </div>
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
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-sans font-semibold text-foreground">Score Distribution</h3>
        </div>
        <div className="h-56 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No relevant tenders</p>
        </div>
      </div>
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
        fill="hsl(240, 10%, 10%)"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={0.5}
        paintOrder="stroke"
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
      <div className="bg-card border border-border shadow-md rounded-md p-3">
        <p className="text-sm font-semibold text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value} tender{data.value !== 1 ? 's' : ''} ({percentage}%)
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-sans font-semibold text-foreground">Score Distribution</h3>
        <p className="text-muted-foreground text-sm mt-1">{total} relevant tenders</p>
      </div>

      {/* Chart area */}
      <div className="relative">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                stroke="hsl(0, 0%, 100%)"
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
              <span className="text-3xl font-bold text-foreground">{total}</span>
              <div className="text-muted-foreground text-xs mt-1">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground text-xs">
              {item.name}: <span className="text-foreground font-semibold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
