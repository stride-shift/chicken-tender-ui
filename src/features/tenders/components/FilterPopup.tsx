import { useState, useEffect } from 'react'
import { PixelBox } from '@/components/ui/PixelBox'
import { ArcadeButton } from '@/components/ui/ArcadeButton'
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
  isRelevant: null,
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

  const selectStyles = {
    border: '3px solid #c75d32',
    boxShadow: '0 3px 0 #9a3412',
    borderRadius: '4px',
  }

  const labelStyles = 'block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleOverlayClick}
    >
      <PixelBox color="#2d8f8f" bgColor="#fafaf9" className="w-full max-w-lg">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-stone-800 uppercase tracking-wide">
              Filter Tenders
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-stone-500 hover:text-stone-700 transition-colors"
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
                className="w-full px-3 py-2 text-sm bg-white text-stone-700 appearance-none font-bold cursor-pointer"
                style={selectStyles}
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
                className="w-full px-3 py-2 text-sm bg-white text-stone-700 appearance-none font-bold cursor-pointer"
                style={selectStyles}
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
                className="w-full px-3 py-2 text-sm bg-white text-stone-700 appearance-none font-bold cursor-pointer"
                style={selectStyles}
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
                className="w-full px-3 py-2 text-sm bg-white text-stone-700 appearance-none font-bold cursor-pointer"
                style={selectStyles}
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
                className="w-full px-3 py-2 text-sm bg-white text-stone-700 appearance-none font-bold cursor-pointer"
                style={selectStyles}
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
                className="w-full px-3 py-2 text-sm bg-white text-stone-700 appearance-none font-bold cursor-pointer"
                style={selectStyles}
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
                className="w-full px-3 py-2 text-sm bg-white text-stone-700 appearance-none font-bold cursor-pointer"
                style={selectStyles}
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
                <div
                  className="w-10 h-6 bg-stone-300 peer-checked:bg-teal-500 rounded-full relative transition-colors"
                  style={{
                    border: '2px solid #78716c',
                  }}
                >
                  <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 left-0.5 peer-checked:left-[18px] transition-all shadow" />
                </div>
                <span className="ml-2 text-xs font-bold text-stone-600 uppercase tracking-wide">
                  Compulsory Briefing Only
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-200">
            <ArcadeButton
              variant="secondary"
              size="sm"
              onClick={handleClearAll}
            >
              Clear All
            </ArcadeButton>
            <ArcadeButton
              variant="primary"
              size="sm"
              onClick={handleApply}
            >
              Apply Filters
            </ArcadeButton>
          </div>
        </div>
      </PixelBox>
    </div>
  )
}
