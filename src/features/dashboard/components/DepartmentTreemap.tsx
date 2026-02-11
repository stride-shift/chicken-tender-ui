import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { useFilterOptions } from '@/features/tenders/hooks/useFilterOptions'

// Gold gradient palette for bars
const BAR_COLORS = [
  'hsl(45, 93%, 58%)', // primary gold
  'hsl(32, 80%, 45%)', // accent deep gold
  'hsl(40, 88%, 60%)', // bright gold
  'hsl(38, 92%, 50%)', // amber
  'hsl(45, 85%, 65%)', // medium gold
  'hsl(32, 75%, 55%)', // medium amber
  'hsl(45, 90%, 70%)', // soft gold
  'hsl(35, 78%, 50%)', // darker amber
  'hsl(45, 93%, 78%)', // light gold
  'hsl(220, 14%, 80%)', // neutral gray
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-card border border-border shadow-md rounded-md p-3">
      <p className="text-sm font-semibold text-foreground">{data.name}</p>
      <p className="text-sm text-muted-foreground">
        <span className="font-bold text-foreground">{data.value}</span> tender{data.value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

// Custom label to show count at end of bar
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomBarLabel = (props: any) => {
  const { x, y, width, height, value } = props
  const radius = 10

  return (
    <text
      x={x + width + radius}
      y={y + height / 2}
      fill="hsl(240, 8%, 35%)"
      textAnchor="start"
      dominantBaseline="middle"
      fontSize={13}
      fontWeight="600"
      fontFamily="system-ui, sans-serif"
    >
      {value}
    </text>
  )
}

export function DepartmentTreemap() {
  const { departments, isLoading, error } = useFilterOptions()

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-serif font-semibold text-foreground">Tenders by Department</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-serif font-semibold text-foreground">Tenders by Department</h3>
        </div>
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  // Sort by count descending and take top departments
  const allDepartments = [...departments].filter((d) => d.count > 0).sort((a, b) => b.count - a.count)

  // Take top 10, group the rest as "Other"
  const topDepartments = allDepartments.slice(0, 10)
  const otherDepartments = allDepartments.slice(10)

  const sortedDepartments = [...topDepartments]
  if (otherDepartments.length > 0) {
    const otherCount = otherDepartments.reduce((sum, d) => sum + d.count, 0)
    sortedDepartments.push({ id: -1, name: 'Other', count: otherCount })
  }

  const total = departments.reduce((sum, d) => sum + d.count, 0)

  if (sortedDepartments.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-serif font-semibold text-foreground">Tenders by Department</h3>
        </div>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No department data</p>
        </div>
      </div>
    )
  }

  // Transform data for Recharts BarChart (reverse for top-to-bottom display)
  const chartData = sortedDepartments.map((dept) => ({
    name: dept.name,
    value: dept.count,
  })).reverse() // Reverse so highest count is at top

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-serif font-semibold text-foreground">Tenders by Department</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {total} tender{total !== 1 ? 's' : ''} across {departments.filter((d) => d.count > 0).length} department{departments.filter((d) => d.count > 0).length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bar chart area */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220, 14%, 90%)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              stroke="hsl(240, 8%, 35%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(240, 8%, 35%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fill: 'hsl(240, 8%, 35%)' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(220, 14%, 95%)' }} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              label={<CustomBarLabel />}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
