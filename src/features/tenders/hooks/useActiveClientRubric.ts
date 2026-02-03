import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
import type { ClientRubric } from '@/lib/types'

/**
 * Hook to fetch the active rubric for the current client.
 * Used on the Rubric page to display the client's base rubric definition.
 */
export function useActiveClientRubric() {
  const { clientCode } = useAuth()

  return useQuery({
    queryKey: ['activeClientRubric', clientCode],
    queryFn: async () => {
      if (!clientCode) throw new Error('No client selected')

      const { data, error } = await supabase.rpc('get_active_client_rubric', {
        p_client_code: clientCode,
      })
      if (error) throw error
      if (!data || data.length === 0) return null
      return data[0] as ClientRubric
    },
    enabled: !!clientCode,
  })
}
