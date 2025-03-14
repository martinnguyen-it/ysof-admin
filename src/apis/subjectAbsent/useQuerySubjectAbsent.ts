import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { ISubjectAbsentInResponse } from '@/domain/subject/subjectAbsent'
import { getListSubjectAbsents } from '@/services/subjectAbsent'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListSubjectAbsents = (
  subjectId: string,
  enabled: boolean
) => {
  const query = useQuery<ISubjectAbsentInResponse[], AxiosError>({
    queryKey: ['getListSubjectAbsents', subjectId],
    queryFn: () => getListSubjectAbsents(subjectId),
    enabled,
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
