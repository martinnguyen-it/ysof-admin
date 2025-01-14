import { selectSeasonState } from '@atom/seasonAtom'
import { IManySubjectEvaluationInResponse, IParamsGetListSubjectEvaluation } from '@domain/subject/subjectEvaluation'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getListSubjectEvaluation } from '@src/services/subjectEvaluation'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { useRecoilValue } from 'recoil'

export const useGetListSubjectEvaluation = (
  params: Omit<IParamsGetListSubjectEvaluation, 'season'>,
  optionsQuery?: Partial<UseQueryOptions<IManySubjectEvaluationInResponse, AxiosError>>,
) => {
  const season = useRecoilValue(selectSeasonState)
  const query = useQuery<IManySubjectEvaluationInResponse, AxiosError>({
    queryKey: ['getListSubjectEvaluation', params, season],
    queryFn: () => getListSubjectEvaluation({ season, ...params }),
    ...optionsQuery,
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
