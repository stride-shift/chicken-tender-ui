import {
  StatsGrid,
  AlertsRow,
  TenderCarousel,
  ScoreDistributionChart,
  DepartmentTreemap,
} from '@/features/dashboard'

export function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* Header: Stats + Alerts */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <StatsGrid />
        <AlertsRow />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreDistributionChart />
        <DepartmentTreemap />
      </div>

      {/* Featured Carousel */}
      <TenderCarousel />
    </div>
  )
}
