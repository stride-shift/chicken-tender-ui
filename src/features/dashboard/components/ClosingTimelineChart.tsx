import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useRelevantTenders } from '../hooks/useRelevantTenders'
import { PixelBox, Scanlines } from '@/components/ui'

// Arcade-style urgency colors with gradients
const URGENCY_COLORS = {
  week1: { solid: '#ef4444', gradient: ['#f87171', '#ef4444', '#dc2626'] },
  week2: { solid: '#f59e0b', gradient: ['#fbbf24', '#f59e0b', '#d97706'] },
  week3: { solid: '#4ecdc4', gradient: ['#5eead4', '#4ecdc4', '#2d8f8f'] },
  week4: { solid: '#64748b', gradient: ['#94a3b8', '#64748b', '#475569'] },
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
      <PixelBox color="#f59e0b" bgColor="#1c1917">
        <div className="p-4 border-b border-stone-700 bg-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500" />
            <span className="text-xs tracking-widest font-black text-amber-400">CLOSING TIMELINE</span>
          </div>
        </div>
        <div className="h-56 flex items-center justify-center bg-stone-900">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-700 border-t-amber-500" />
        </div>
      </PixelBox>
    )
  }

  if (error) {
    return (
      <PixelBox color="#f59e0b" bgColor="#1c1917">
        <div className="p-4 border-b border-stone-700 bg-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500" />
            <span className="text-xs tracking-widest font-black text-amber-400">CLOSING TIMELINE</span>
          </div>
        </div>
        <div className="p-4 bg-stone-900">
          <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3">
            <p className="text-sm font-mono">{error.message}</p>
          </div>
        </div>
      </PixelBox>
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
      <PixelBox color="#f59e0b" bgColor="#1c1917">
        <div className="p-4 border-b border-stone-700 bg-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500" />
            <span className="text-xs tracking-widest font-black text-amber-400">CLOSING TIMELINE</span>
          </div>
        </div>
        <div className="h-56 flex items-center justify-center bg-stone-900 text-stone-500">
          <p className="font-mono text-sm">NO TENDERS CLOSING IN 28 DAYS</p>
        </div>
      </PixelBox>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload as TimelineData
    const colors = URGENCY_COLORS[data.colorKey]

    return (
      <div
        className="bg-stone-900 border-2 px-3 py-2"
        style={{
          borderColor: colors.solid,
          boxShadow: `4px 4px 0 ${colors.solid}44`
        }}
      >
        <p className="text-sm font-black font-mono" style={{ color: colors.solid }}>{data.week}</p>
        <p className="text-xs text-stone-500 font-mono">{data.label}</p>
        <p className="text-sm text-stone-300 font-mono mt-1">
          <span className="font-bold text-stone-100">{data.count}</span> tender{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    )
  }

  const maxCount = Math.max(...chartData.map((d) => d.count), 1)

  return (
    <PixelBox color="#f59e0b" bgColor="#1c1917">
      {/* Header */}
      <div className="p-4 border-b border-stone-700 bg-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500" />
          <span className="text-xs tracking-widest font-black text-amber-400">CLOSING TIMELINE</span>
        </div>
        <div className="text-stone-400 text-sm mt-1 font-mono">
          {totalClosing} tender{totalClosing !== 1 ? 's' : ''} closing in next 28 days
        </div>
      </div>

      {/* Chart area with dark bg */}
      <div className="relative bg-stone-900 p-4">
        <Scanlines opacity={0.02} />
        <div className="h-48 relative z-0">
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
                <filter id="barGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <XAxis
                type="number"
                domain={[0, maxCount]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis
                type="category"
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
                stroke="#0a0a0a"
                strokeWidth={1}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#bar-gradient-${entry.colorKey})`}
                    style={{ filter: 'url(#barGlow)' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-stone-800 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3"
            style={{
              backgroundColor: URGENCY_COLORS.week1.solid,
              boxShadow: `0 0 8px ${URGENCY_COLORS.week1.solid}66`
            }}
          />
          <span className="text-stone-400 text-xs font-mono">CRITICAL</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3"
            style={{
              backgroundColor: URGENCY_COLORS.week2.solid,
              boxShadow: `0 0 8px ${URGENCY_COLORS.week2.solid}66`
            }}
          />
          <span className="text-stone-400 text-xs font-mono">URGENT</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3"
            style={{
              backgroundColor: URGENCY_COLORS.week3.solid,
              boxShadow: `0 0 8px ${URGENCY_COLORS.week3.solid}66`
            }}
          />
          <span className="text-stone-400 text-xs font-mono">NORMAL</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3"
            style={{
              backgroundColor: URGENCY_COLORS.week4.solid,
              boxShadow: `0 0 8px ${URGENCY_COLORS.week4.solid}66`
            }}
          />
          <span className="text-stone-400 text-xs font-mono">FUTURE</span>
        </div>
      </div>
    </PixelBox>
  )
}
