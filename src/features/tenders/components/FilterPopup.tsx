import { useState, useEffect } from 'react'
import type { TenderFilters } from '../hooks/useTenders'
import type { FilterOption } from '@/lib/types'

interface FilterPopupProps {
  isOpen: boolean
  onClose: () => void
  filters: TenderFilters
  onApply: (filters: TenderFilters) => void
  filterOptions: {
    provinces: FilterOption[]
    departments: FilterOption[]
    categories: FilterOption[]
  }
}

type RelevanceFilter = 'all' | 'relevant' | 'not_recommended'
type StatusFilter = 'active' | 'closed' | 'all'
type SortByOption = 'published_date' | 'recommendation' | 'closing_date' | 'score'

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

const DAYS_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '3', label: 'At least 3 days' },
  { value: '7', label: 'At least 7 days' },
  { value: '14', label: 'At least 14 days' },
  { value: '30', label: 'At least 30 days' },
]

const SORT_OPTIONS: { value: SortByOption; label: string }[] = [
  { value: 'published_date', label: 'Newest First' },
  { value: 'recommendation', label: 'Most Relevant' },
  { value: 'closing_date', label: 'Closing Soon' },
  { value: 'score', label: 'Highest Score' },
]

// Close icon component
const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export function FilterPopup({
  isOpen,
  onClose,
  filters,
  onApply,
  filterOptions,
}: FilterPopupProps) {
  // Internal state for filters - only applied when user clicks Apply
  const [localFilters, setLocalFilters] = useState<TenderFilters>(filters)

  // Sync local state when external filters change or popup opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters)
    }
  }, [isOpen, filters])

  // Convert isRelevant boolean to relevance filter value
  const relevanceValue: RelevanceFilter =
    localFilters.isRelevant === null
      ? 'all'
      : localFilters.isRelevant
        ? 'relevant'
        : 'not_recommended'

  // Convert status to status filter value
  const statusValue: StatusFilter =
    localFilters.status === null ? 'all' : localFilters.status === 'active' ? 'active' : 'closed'

  const handleRelevanceChange = (value: RelevanceFilter) => {
    const isRelevant = value === 'all' ? null : value === 'relevant'
    setLocalFilters({ ...localFilters, isRelevant })
  }

  const handleStatusChange = (value: StatusFilter) => {
    const status = value === 'all' ? null : value
    setLocalFilters({ ...localFilters, status })
  }

  const handleProvinceChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      provinceId: value === '' ? null : parseInt(value, 10),
    })
  }

  const handleDepartmentChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      departmentId: value === '' ? null : parseInt(value, 10),
    })
  }

  const handleCategoryChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      categoryId: value === '' ? null : parseInt(value, 10),
    })
  }

  const handleDaysChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      minDaysUntilClose: value === '' ? null : parseInt(value, 10),
    })
  }

  const handleSortChange = (value: SortByOption) => {
    // Adjust sortDesc based on the sort option
    const sortDesc = value === 'closing_date' ? false : true
    setLocalFilters({ ...localFilters, sortBy: value, sortDesc })
  }

  const handleBriefingToggle = () => {
    // This filter isn't in TenderFilters yet, but we'll add the UI for it
    // For now, this is a placeholder that can be connected later
  }

  const handleClearAll = () => {
    setLocalFilters(DEFAULT_FILTERS)
  }

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const labelStyles = 'block text-label text-muted-foreground uppercase tracking-wider mb-2'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-lg">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Filter Tenders
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Relevance */}
            <div>
              <label className={labelStyles}>Relevance</label>
              <select
                value={relevanceValue}
                onChange={(e) => handleRelevanceChange(e.target.value as RelevanceFilter)}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md appearance-none cursor-pointer hover:bg-muted transition-colors"
              >
                <option value="all">All Tenders</option>
                <option value="relevant">Relevant Only</option>
                <option value="not_recommended">Not Recommended</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={labelStyles}>Status</label>
              <select
                value={statusValue}
                onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md appearance-none cursor-pointer hover:bg-muted transition-colors"
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="all">All</option>
              </select>
            </div>

            {/* Province */}
            <div>
              <label className={labelStyles}>Province</label>
              <select
                value={localFilters.provinceId ?? ''}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md appearance-none cursor-pointer hover:bg-muted transition-colors"
              >
                <option value="">All Provinces</option>
                {filterOptions.provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name} ({province.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className={labelStyles}>Department</label>
              <select
                value={localFilters.departmentId ?? ''}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md appearance-none cursor-pointer hover:bg-muted transition-colors"
              >
                <option value="">All Departments</option>
                {filterOptions.departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className={labelStyles}>Category</label>
              <select
                value={localFilters.categoryId ?? ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md appearance-none cursor-pointer hover:bg-muted transition-colors"
              >
                <option value="">All Categories</option>
                {filterOptions.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Days until close */}
            <div>
              <label className={labelStyles}>Days Until Close</label>
              <select
                value={localFilters.minDaysUntilClose ?? ''}
                onChange={(e) => handleDaysChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md appearance-none cursor-pointer hover:bg-muted transition-colors"
              >
                {DAYS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div>
              <label className={labelStyles}>Sort By</label>
              <select
                value={localFilters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortByOption)}
                className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-md appearance-none cursor-pointer hover:bg-muted transition-colors"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Compulsory briefing toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  onChange={handleBriefingToggle}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-muted peer-checked:bg-primary rounded-full relative transition-colors border border-border">
                  <div className="absolute w-4 h-4 bg-background rounded-full top-0.5 left-0.5 peer-checked:left-[18px] transition-all shadow-sm" />
                </div>
                <span className="ml-2 text-xs text-muted-foreground uppercase tracking-wider">
                  Compulsory Briefing Only
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 transition-opacity"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
