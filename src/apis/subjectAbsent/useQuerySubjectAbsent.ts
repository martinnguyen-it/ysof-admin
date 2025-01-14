import { ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getListSubjectAbsents } from '@src/services/subjectAbsent'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useGetListSubjectAbsents = (subjectId: string, enabled: boolean) => {
  const query = useQuery<ISubjectAbsentInResponse[], AxiosError>({
    queryKey: ['getListSubjectAbsents', subjectId],
    queryFn: () => getListSubjectAbsents(subjectId),
    enabled,
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
