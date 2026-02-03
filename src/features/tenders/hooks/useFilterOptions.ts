import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
import type { FilterOptions, FilterOption } from '@/lib/types'

export interface UseFilterOptionsResult {
  provinces: FilterOption[]
  departments: FilterOption[]
  categories: FilterOption[]
  isLoading: boolean
  error: Error | null
}

export function useFilterOptions(): UseFilterOptionsResult {
  const { clientCode } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['filterOptions', clientCode],
    queryFn: async () => {
      if (!clientCode) throw new Error('No client selected')

      const { data, error } = await supabase.rpc('get_filter_options', {
        p_client_code: clientCode,
      })

      if (error) throw error

      // The function returns a single row with provinces, departments, categories as JSONB
      const row = data?.[0] as FilterOptions | undefined
      return row ?? { provinces: [], departments: [], categories: [] }
    },
    enabled: !!clientCode,
    staleTime: 5 * 60 * 1000, // 5 minutes - filter options don't change frequently
  })

  return {
    provinces: data?.provinces ?? [],
    departments: data?.departments ?? [],
    categories: data?.categories ?? [],
    isLoading,
    error: error as Error | null,
  }
}
