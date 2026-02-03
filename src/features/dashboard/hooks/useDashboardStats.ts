import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
import type { DashboardStats } from '@/lib/types'

/**
 * Hook to fetch dashboard statistics for the current client.
 * Calls the get_dashboard_stats RPC function and returns typed DashboardStats.
 */
export function useDashboardStats() {
  const { clientCode } = useAuth()

  return useQuery({
    queryKey: ['dashboardStats', clientCode],
    queryFn: async () => {
      if (!clientCode) throw new Error('No client selected')

      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        p_client_code: clientCode,
      })

      if (error) throw error
      return data[0] as DashboardStats
    },
    enabled: !!clientCode,
  })
}
