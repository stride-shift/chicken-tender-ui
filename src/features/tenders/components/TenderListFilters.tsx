import type { FilterOption } from '@/lib/types'
import type { TenderFilters } from '../hooks/useTenders'
import { FilterPopup } from './FilterPopup'

// Simple search icon component
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

// Filter icon component
const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

interface TenderListFiltersProps {
  filters: TenderFilters
  onFiltersChange: (filters: TenderFilters) => void
  filterOptions: {
    provinces: FilterOption[]
    departments: FilterOption[]
    categories: FilterOption[]
  }
  isLoading?: boolean
  onOpenFilterPopup: () => void
  isFilterPopupOpen: boolean
  onCloseFilterPopup: () => void
  onApplyFilters: (filters: TenderFilters) => void
}

// Count active filters (non-default values)
const countActiveFilters = (filters: TenderFilters): number => {
  let count = 0
  if (filters.isRelevant !== true) count++
  if (filters.provinceId !== null) count++
  if (filters.departmentId !== null) count++
  if (filters.categoryId !== null) count++
  if (filters.status !== 'active') count++  // non-default
  if (filters.minDaysUntilClose !== null) count++
  if (filters.sortBy !== 'published_date' || !filters.sortDesc) count++
  return count
}

export function TenderListFilters({
  filters,
  onFiltersChange,
  filterOptions,
  isLoading = false,
  onOpenFilterPopup,
  isFilterPopupOpen,
  onCloseFilterPopup,
  onApplyFilters,
}: TenderListFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchText: value === '' ? null : value,
    })
  }

  const activeFilterCount = countActiveFilters(filters)

  return (
    <div className="space-y-2">
      {/* Search input and Filter button row */}
      <div className="flex gap-2">
        {/* Search input with icon inside */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search tenders..."
            value={filters.searchText ?? ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-md bg-input px-3 py-2 pl-10 text-sm border border-border focus:ring-2 focus:ring-ring transition-all outline-none"
          />
        </div>

        {/* Filter button */}
        <div className="relative">
          <button
            onClick={onOpenFilterPopup}
            disabled={isLoading}
            className="h-10 border border-border rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FilterIcon className="w-4 h-4" />
            Filter
          </button>

          {/* Active filter count badge */}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-primary rounded-full border-2 border-card">
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      {/* Filter Popup */}
      <FilterPopup
        isOpen={isFilterPopupOpen}
        onClose={onCloseFilterPopup}
        filters={filters}
        onApply={onApplyFilters}
        filterOptions={filterOptions}
      />
    </div>
  )
}
