import type { FilterOption } from '@/lib/types'

// Simple search icon component
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
import type { TenderFilters } from '../hooks/useTenders'

interface TenderListFiltersProps {
  filters: TenderFilters
  onFiltersChange: (filters: TenderFilters) => void
  filterOptions: {
    provinces: FilterOption[]
    departments: FilterOption[]
    categories: FilterOption[]
  }
  isLoading?: boolean
}

type RelevanceFilter = 'all' | 'relevant' | 'not_recommended'

export function TenderListFilters({
  filters,
  onFiltersChange,
  filterOptions,
  isLoading = false,
}: TenderListFiltersProps) {
  // Convert isRelevant boolean to relevance filter value
  const relevanceValue: RelevanceFilter =
    filters.isRelevant === null
      ? 'all'
      : filters.isRelevant
        ? 'relevant'
        : 'not_recommended'

  const handleRelevanceChange = (value: RelevanceFilter) => {
    const isRelevant = value === 'all' ? null : value === 'relevant'
    onFiltersChange({ ...filters, isRelevant })
  }

  const handleProvinceChange = (value: string) => {
    onFiltersChange({
      ...filters,
      provinceId: value === '' ? null : parseInt(value, 10),
    })
  }

  const handleDepartmentChange = (value: string) => {
    onFiltersChange({
      ...filters,
      departmentId: value === '' ? null : parseInt(value, 10),
    })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      categoryId: value === '' ? null : parseInt(value, 10),
    })
  }

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchText: value === '' ? null : value,
    })
  }

  const selectStyles = {
    border: '3px solid #c75d32',
    boxShadow: '0 3px 0 #9a3412',
    borderRadius: '4px'
  }

  return (
    <div className="space-y-2">
      {/* Search input with thick border */}
      <div className="flex">
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

      {/* Filter dropdowns - light style */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Relevance filter */}
        <select
          value={relevanceValue}
          onChange={(e) => handleRelevanceChange(e.target.value as RelevanceFilter)}
          className="px-2 py-1.5 text-xs bg-white text-stone-700 appearance-none font-bold cursor-pointer"
          style={selectStyles}
          disabled={isLoading}
        >
          <option value="all">All Tenders</option>
          <option value="relevant">Relevant</option>
          <option value="not_recommended">Not Recommended</option>
        </select>

        {/* Province filter */}
        <select
          value={filters.provinceId ?? ''}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="px-2 py-1.5 text-xs bg-white text-stone-700 appearance-none font-bold cursor-pointer"
          style={selectStyles}
          disabled={isLoading}
        >
          <option value="">All Provinces</option>
          {filterOptions.provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name} ({province.count})
            </option>
          ))}
        </select>

        {/* Department filter */}
        <select
          value={filters.departmentId ?? ''}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          className="px-2 py-1.5 text-xs bg-white text-stone-700 appearance-none font-bold cursor-pointer"
          style={selectStyles}
          disabled={isLoading}
        >
          <option value="">All Departments</option>
          {filterOptions.departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name} ({dept.count})
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={filters.categoryId ?? ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-2 py-1.5 text-xs bg-white text-stone-700 appearance-none font-bold cursor-pointer"
          style={selectStyles}
          disabled={isLoading}
        >
          <option value="">All Categories</option>
          {filterOptions.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
