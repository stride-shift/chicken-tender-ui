import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ClientRubric } from '@/lib/types'

export function useClientRubric(rubricPk: number | null) {
  return useQuery({
    queryKey: ['clientRubric', rubricPk],
    queryFn: async () => {
      if (!rubricPk) return null
      const { data, error } = await supabase.rpc('get_client_rubric', {
        p_rubric_pk: rubricPk,
      })
      if (error) throw error
      if (!data || data.length === 0) return null
      return data[0] as ClientRubric
    },
    enabled: rubricPk !== null,
  })
}
