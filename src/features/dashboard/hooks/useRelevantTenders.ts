import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
import type { TenderListItem } from '@/lib/types'

export interface UseRelevantTendersParams {
  limit?: number
}

export interface UseRelevantTendersResult {
  tenders: TenderListItem[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch relevant tenders for the dashboard.
 * Fetches tenders with recommendation of excellent_fit, good_fit, or worth_reviewing.
 * Sorted by recommendation (best first).
 */
export function useRelevantTenders(
  params: UseRelevantTendersParams = {}
): UseRelevantTendersResult {
  const { clientCode } = useAuth()
  const { limit = 12 } = params

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['relevantTenders', clientCode, limit],
    queryFn: async () => {
      if (!clientCode) throw new Error('No client selected')

      const { data, error } = await supabase.rpc('get_tenders_paginated', {
        p_client_code: clientCode,
        p_is_relevant: true,
        p_province_id: null,
        p_department_id: null,
        p_category_id: null,
        p_closing_from: null,
        p_closing_to: null,
        p_has_compulsory_briefing: null,
        p_search_text: null,
        p_sort_by: 'recommendation',
        p_sort_desc: false,
        p_limit: limit,
        p_offset: 0,
      })

      if (error) throw error
      return data as TenderListItem[]
    },
    enabled: !!clientCode,
  })

  return {
    tenders: data ?? [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
