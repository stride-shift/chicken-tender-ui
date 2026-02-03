import { useQuery } from '@tanstack/react-query'
import { supabase, getClientCode } from '@/lib/supabase'
import type { ClientRubric } from '@/lib/types'

/**
 * Hook to fetch the active rubric for the current client.
 * Used on the Rubric page to display the client's base rubric definition.
 */
export function useActiveClientRubric() {
  const clientCode = getClientCode()

  return useQuery({
    queryKey: ['activeClientRubric', clientCode],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_active_client_rubric', {
        p_client_code: clientCode,
      })
      if (error) throw error
      if (!data || data.length === 0) return null
      return data[0] as ClientRubric
    },
  })
}
