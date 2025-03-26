import { useQuery } from '@tanstack/react-query'
import { IDailyBibleQuotesInResponse } from '@/domain/dailyBible'
import { getDailyBibleQuotes } from '@/services/dailyBible'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetDailyBibleQuotes = () => {
  const query = useQuery<IDailyBibleQuotesInResponse, Error>({
    queryKey: ['getDailyBibleQuotes'],
    queryFn: () => getDailyBibleQuotes(),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)
  return query
}
