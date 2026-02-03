import { useQuery } from '@tanstack/react-query'
import { supabase, getClientCode } from '@/lib/supabase'
import type { TenderDetail } from '@/lib/types'

interface UseTenderDetailOptions {
  tenderId: number | null
}

interface UseTenderDetailResult {
  tender: TenderDetail | null
  isLoading: boolean
  error: Error | null
}

export function useTenderDetail({ tenderId }: UseTenderDetailOptions): UseTenderDetailResult {
  const clientCode = getClientCode()

  const { data, isLoading, error } = useQuery({
    queryKey: ['tenderDetail', tenderId, clientCode],
    queryFn: async () => {
      if (!tenderId) return null

      const { data, error } = await supabase.rpc('get_tender_detail', {
        p_tender_pk: tenderId,
        p_client_code: clientCode,
      })

      if (error) throw error

      // The RPC returns an array, we want the first (and only) result
      if (!data || data.length === 0) return null
      return data[0] as TenderDetail
    },
    enabled: tenderId !== null,
  })

  return {
    tender: data ?? null,
    isLoading,
    error: error as Error | null,
  }
}
