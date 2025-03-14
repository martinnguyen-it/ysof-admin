import { AxiosError } from 'axios'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { selectSeasonState } from '@/atom/seasonAtom'
import {
  IManySubjectEvaluationInResponse,
  IParamsGetListSubjectEvaluation,
} from '@/domain/subject/subjectEvaluation'
import { getListSubjectEvaluation } from '@/services/subjectEvaluation'
import { useRecoilValue } from 'recoil'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListSubjectEvaluation = (
  params: Omit<IParamsGetListSubjectEvaluation, 'season'>,
  optionsQuery?: Partial<
    UseQueryOptions<IManySubjectEvaluationInResponse, AxiosError>
  >
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
