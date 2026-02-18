import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useRelevantTenders } from '../hooks/useRelevantTenders'

// Urgency colors: red for critical, orange for urgent, blue for normal, gray for future
const URGENCY_COLORS = {
  week1: { solid: 'hsl(0, 84%, 60%)', gradient: ['hsl(0, 84%, 70%)', 'hsl(0, 84%, 60%)', 'hsl(0, 84%, 50%)'] },
  week2: { solid: 'hsl(25, 95%, 53%)', gradient: ['hsl(25, 95%, 63%)', 'hsl(25, 95%, 53%)', 'hsl(25, 95%, 43%)'] },
  week3: { solid: 'hsl(221, 83%, 53%)', gradient: ['hsl(221, 83%, 63%)', 'hsl(221, 83%, 53%)', 'hsl(221, 83%, 43%)'] },
  week4: { solid: 'hsl(220, 14%, 65%)', gradient: ['hsl(220, 14%, 75%)', 'hsl(220, 14%, 65%)', 'hsl(220, 14%, 55%)'] },
}

interface TimelineData {
  week: string
  count: number
  colorKey: keyof typeof URGENCY_COLORS
  label: string
}

export function ClosingTimelineChart() {
  const { tenders, isLoading, error } = useRelevantTenders({ limit: 50 })

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-sans font-semibold text-foreground">Closing Timeline</h3>
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
          <h3 className="font-sans font-semibold text-foreground">Closing Timeline</h3>
        </div>
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  // Group tenders by closing week
  const activeTenders = tenders.filter((t) => t.days_until_close >= 0)

  const week1 = activeTenders.filter((t) => t.days_until_close <= 7).length
  const week2 = activeTenders.filter((t) => t.days_until_close > 7 && t.days_until_close <= 14).length
  const week3 = activeTenders.filter((t) => t.days_until_close > 14 && t.days_until_close <= 21).length
  const week4 = activeTenders.filter((t) => t.days_until_close > 21 && t.days_until_close <= 28).length

  const chartData: TimelineData[] = [
    { week: 'WEEK 1', count: week1, colorKey: 'week1', label: '0-7 days' },
    { week: 'WEEK 2', count: week2, colorKey: 'week2', label: '8-14 days' },
    { week: 'WEEK 3', count: week3, colorKey: 'week3', label: '15-21 days' },
    { week: 'WEEK 4', count: week4, colorKey: 'week4', label: '22-28 days' },
  ]

  const totalClosing = week1 + week2 + week3 + week4

  if (totalClosing === 0) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-sans font-semibold text-foreground">Closing Timeline</h3>
        </div>
        <div className="h-56 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No tenders closing in 28 days</p>
        </div>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload as TimelineData
    const colors = URGENCY_COLORS[data.colorKey]

    return (
      <div className="bg-card border border-border shadow-md rounded-md p-3">
        <p className="text-sm font-semibold" style={{ color: colors.solid }}>{data.week}</p>
        <p className="text-xs text-muted-foreground">{data.label}</p>
        <p className="text-sm text-foreground mt-1">
          <span className="font-bold">{data.count}</span> tender{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    )
  }

  const maxCount = Math.max(...chartData.map((d) => d.count), 1)

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-sans font-semibold text-foreground">Closing Timeline</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {totalClosing} tender{totalClosing !== 1 ? 's' : ''} closing in next 28 days
        </p>
      </div>

      {/* Chart area */}
      <div className="relative">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <defs>
                {Object.entries(URGENCY_COLORS).map(([key, colors]) => (
                  <linearGradient key={key} id={`bar-gradient-${key}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={colors.gradient[0]} />
                    <stop offset="50%" stopColor={colors.gradient[1]} />
                    <stop offset="100%" stopColor={colors.gradient[2]} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                type="number"
                domain={[0, maxCount]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(240, 8%, 35%)', fontSize: 10, fontFamily: 'system-ui, sans-serif' }}
              />
              <YAxis
                type="category"
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(240, 10%, 10%)', fontSize: 11, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
                stroke="hsl(220, 14%, 90%)"
                strokeWidth={1}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#bar-gradient-${entry.colorKey})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: URGENCY_COLORS.week1.solid }}
          />
          <span className="text-muted-foreground text-xs">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: URGENCY_COLORS.week2.solid }}
          />
          <span className="text-muted-foreground text-xs">Urgent</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: URGENCY_COLORS.week3.solid }}
          />
          <span className="text-muted-foreground text-xs">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: URGENCY_COLORS.week4.solid }}
          />
          <span className="text-muted-foreground text-xs">Future</span>
        </div>
      </div>
    </div>
  )
}
