import {
  StatsGrid,
  TenderCarousel,
  ScoreDistributionChart,
  DepartmentTreemap,
  CalendarPlaceholder,
} from '@/features/dashboard'

export function DashboardPage() {
  return (
    <div className="space-y-4 bg-background">
      {/* Header: Stats */}
      <StatsGrid />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScoreDistributionChart />
        <DepartmentTreemap />
        <CalendarPlaceholder />
      </div>

      {/* Featured Carousel */}
      <TenderCarousel />
    </div>
  )
}
