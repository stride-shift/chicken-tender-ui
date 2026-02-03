import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
import type { TenderListItem } from '@/lib/types'

export interface TenderFilters {
  isRelevant: boolean | null
  provinceId: number | null
  departmentId: number | null
  categoryId: number | null
  searchText: string | null
  sortBy: 'recommendation' | 'closing_date' | 'score' | 'published_date'
  sortDesc: boolean
}

export interface UseTendersParams extends TenderFilters {
  page: number
  limit: number
}

export interface UseTendersResult {
  tenders: TenderListItem[]
  totalCount: number
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const DEFAULT_LIMIT = 25

export function useTenders(params: Partial<UseTendersParams> = {}): UseTendersResult {
  const { clientCode } = useAuth()

  const {
    isRelevant = null,
    provinceId = null,
    departmentId = null,
    categoryId = null,
    searchText = null,
    sortBy = 'recommendation',
    sortDesc = false,
    page = 1,
    limit = DEFAULT_LIMIT,
  } = params

  const offset = (page - 1) * limit

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'tenders',
      clientCode,
      isRelevant,
      provinceId,
      departmentId,
      categoryId,
      searchText,
      sortBy,
      sortDesc,
      page,
      limit,
    ],
    queryFn: async () => {
      if (!clientCode) throw new Error('No client selected')

      const { data, error } = await supabase.rpc('get_tenders_paginated', {
        p_client_code: clientCode,
        p_is_relevant: isRelevant,
        p_province_id: provinceId,
        p_department_id: departmentId,
        p_category_id: categoryId,
        p_closing_from: null,
        p_closing_to: null,
        p_has_compulsory_briefing: null,
        p_search_text: searchText || null,
        p_sort_by: sortBy,
        p_sort_desc: sortDesc,
        p_limit: limit,
        p_offset: offset,
      })

      if (error) throw error
      return data as TenderListItem[]
    },
    enabled: !!clientCode,
  })

  const tenders = data ?? []
  const totalCount = tenders.length > 0 ? tenders[0].total_count : 0

  return {
    tenders,
    totalCount,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
