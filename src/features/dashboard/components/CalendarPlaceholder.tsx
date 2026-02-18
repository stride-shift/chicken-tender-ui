// CalendarPlaceholder — static mini calendar teaser for upcoming lifecycle management

const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Colored dots hint at future functionality: green = briefing, amber = closing, blue = deadline
const DOT_COLORS: Record<number, string> = {
  7:  'bg-green-400',
  12: 'bg-amber-400',
  19: 'bg-blue-400',
  24: 'bg-green-400',
  27: 'bg-amber-400',
}

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  // month is 0-indexed (JS Date)
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun … 6=Sat
  // Convert to Mon-based offset: Mon=0, Tue=1, … Sun=6
  const offset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function CalendarPlaceholder() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed
  const today = now.getDate()

  const monthName = now.toLocaleString('default', { month: 'long' })
  const cells = buildCalendarGrid(year, month)

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-sans font-semibold text-foreground">Tender Calendar</h3>
        <p className="text-muted-foreground text-sm mt-1">Track deadlines &amp; milestones</p>
      </div>

      {/* Month label */}
      <p className="text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-3 text-center">
        {monthName} {year}
      </p>

      {/* Calendar grid with blur overlay */}
      <div className="relative">
        <div className="grid grid-cols-7 gap-y-1">
          {/* Day-of-week headers */}
          {DAY_HEADERS.map((d, i) => (
            <div
              key={i}
              className="text-center text-[11px] font-medium text-muted-foreground pb-1"
            >
              {d}
            </div>
          ))}

          {/* Day cells */}
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={idx} />
            }

            const isToday = day === today
            const dotColor = DOT_COLORS[day]
            const isFuture = day > today

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-0.5 py-0.5"
              >
                <span
                  className={[
                    'text-[12px] leading-tight w-6 h-6 flex items-center justify-center rounded-full',
                    isToday
                      ? 'bg-blue-500 text-white font-bold'
                      : isFuture
                      ? 'text-foreground/80'
                      : 'text-muted-foreground/60',
                  ].join(' ')}
                >
                  {day}
                </span>
                {dotColor && (day >= today) ? (
                  <span className={`w-1 h-1 rounded-full ${dotColor} opacity-70`} />
                ) : (
                  <span className="w-1 h-1" />
                )}
              </div>
            )
          })}
        </div>

        {/* Frosted blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/60 flex flex-col items-center justify-center rounded-md">
          <span className="text-sm font-semibold tracking-wide text-muted-foreground/80 uppercase">
            Coming Soon
          </span>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Tender lifecycle tracking
          </p>
        </div>
      </div>
    </div>
  )
}
