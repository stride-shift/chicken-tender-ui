import { useState, useCallback } from 'react'
import { useTenders, type TenderFilters } from '../hooks/useTenders'
import { useFilterOptions } from '../hooks/useFilterOptions'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { TenderListFilters } from './TenderListFilters'
import { TenderListItem } from './TenderListItem'
import { Pagination } from '@/components/shared/Pagination'
interface TenderListPanelProps {
  selectedTenderId: number | null
  onSelectTender: (tenderId: number) => void
}

const ITEMS_PER_PAGE = 25

const DEFAULT_FILTERS: TenderFilters = {
  isRelevant: true,
  provinceId: null,
  departmentId: null,
  categoryId: null,
  searchText: null,
  sortBy: 'published_date',
  sortDesc: true,
  status: 'active',
  minDaysUntilClose: null,
}

export function TenderListPanel({ selectedTenderId, onSelectTender }: TenderListPanelProps) {
  const [filters, setFilters] = useState<TenderFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false)

  // Fetch tenders with current filters and pagination
  const { tenders, totalCount, isLoading, error } = useTenders({
    ...filters,
    page,
    limit: ITEMS_PER_PAGE,
  })

  // Fetch filter options
  const {
    provinces,
    departments,
    categories,
    isLoading: filterOptionsLoading,
  } = useFilterOptions()

  // Fetch dashboard stats for total active tenders count
  const { data: dashboardStats } = useDashboardStats()

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // Handle filter changes - reset to page 1 when filters change
  const handleFiltersChange = useCallback((newFilters: TenderFilters) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  // Popup handlers
  const handleOpenFilterPopup = () => setIsFilterPopupOpen(true)
  const handleCloseFilterPopup = () => setIsFilterPopupOpen(false)
  const handleApplyFilters = (newFilters: TenderFilters) => {
    setFilters(newFilters)
    setPage(1)
    setIsFilterPopupOpen(false)
  }

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden bg-card border-r border-border">
      {/* Search header */}
      <div className="p-3 bg-card border-b border-border">
        <TenderListFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          filterOptions={{ provinces, departments, categories }}
          isLoading={filterOptionsLoading}
          onOpenFilterPopup={handleOpenFilterPopup}
          isFilterPopupOpen={isFilterPopupOpen}
          onCloseFilterPopup={handleCloseFilterPopup}
          onApplyFilters={handleApplyFilters}
        />

        {/* Results count */}
        <div className="mt-2 flex items-center gap-2">
          {isLoading ? (
            <span className="text-muted-foreground text-sm">Loading...</span>
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {totalCount}
              </span>
              <span className="text-muted-foreground text-sm">
                {dashboardStats?.total_active
                  ? `of ${dashboardStats.total_active} active tender${dashboardStats.total_active === 1 ? '' : 's'}`
                  : `tender${totalCount === 1 ? '' : 's'}`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tender list */}
      <div className="flex-1 overflow-y-auto bg-background relative">
        <div className="relative z-0">
          {error ? (
            <div className="text-sm text-destructive p-4">
              Error loading tenders: {error.message}
            </div>
          ) : isLoading ? (
            <div className="p-2 space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 border-b border-border animate-pulse"
                >
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : tenders.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No tenders found matching your criteria
            </div>
          ) : (
            <div>
              {tenders.map((tender) => (
                <TenderListItem
                  key={tender.tender_pk}
                  tender={tender}
                  isSelected={selectedTenderId === tender.tender_pk}
                  onClick={onSelectTender}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="p-2 bg-card border-t border-border">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
