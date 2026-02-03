import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
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
  const { clientCode } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['tenderDetail', tenderId, clientCode],
    queryFn: async () => {
      if (!tenderId) return null
      if (!clientCode) throw new Error('No client selected')

      const { data, error } = await supabase.rpc('get_tender_detail', {
        p_tender_pk: tenderId,
        p_client_code: clientCode,
      })

      if (error) throw error

      // The RPC returns an array, we want the first (and only) result
      if (!data || data.length === 0) return null
      return data[0] as TenderDetail
    },
    enabled: tenderId !== null && !!clientCode,
  })

  return {
    tender: data ?? null,
    isLoading,
    error: error as Error | null,
  }
}
