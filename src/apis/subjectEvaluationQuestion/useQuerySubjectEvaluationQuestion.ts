import { AxiosError } from 'axios'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { IEvaluationQuestionResponse } from '@/domain/subject/subjectEvaluationQuestion'
import { getSubjectEvaluationQuestions } from '@/services/subjectEvaluationQuestion'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export interface IQuerySubjectEvaluationQuestions
  extends Partial<UseQueryOptions<IEvaluationQuestionResponse, AxiosError>> {
  subjectId: string
}
export const useGetSubjectEvaluationQuestions = ({
  subjectId,
  ...props
}: IQuerySubjectEvaluationQuestions) => {
  const query = useQuery<IEvaluationQuestionResponse, AxiosError>({
    queryKey: ['getSubjectEvaluationQuestions', subjectId],
    queryFn: () => getSubjectEvaluationQuestions(subjectId),
    ...props,
  })
  useQueryErrorToast(
    query.isError && query?.error?.status !== 404,
    query?.error?.message!
  )

  return query
}
