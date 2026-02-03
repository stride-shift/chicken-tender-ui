import type { FilterOption } from '@/lib/types'
import type { TenderFilters } from '../hooks/useTenders'
import { FilterPopup } from './FilterPopup'
import { ArcadeButton } from '@/components/ui'

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
  if (filters.isRelevant !== null) count++
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
        {/* Search input with thick border */}
        <div className="flex flex-1">
          <input
            type="text"
            placeholder="Search tenders..."
            value={filters.searchText ?? ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-white text-stone-800 placeholder-stone-400 outline-none font-mono text-sm"
            style={{
              border: '3px solid #2d8f8f',
              borderRight: 'none',
              borderTopLeftRadius: '4px',
              borderBottomLeftRadius: '4px'
            }}
          />
          <button
            className="px-3 flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
              boxShadow: '0 3px 0 #1a5f5f',
              borderTopRightRadius: '4px',
              borderBottomRightRadius: '4px'
            }}
          >
            <SearchIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Filter button */}
        <div className="relative">
          <ArcadeButton
            variant="secondary"
            size="sm"
            onClick={onOpenFilterPopup}
            disabled={isLoading}
            icon={<FilterIcon className="w-4 h-4" />}
          >
            Filter
          </ArcadeButton>

          {/* Active filter count badge */}
          {activeFilterCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-black text-white rounded-full"
              style={{
                background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                boxShadow: '0 2px 0 #991b1b',
              }}
            >
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
