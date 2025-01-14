import { IEvaluationQuestionResponse } from '@domain/subject/subjectEvaluationQuestion'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getSubjectEvaluationQuestions } from '@src/services/subjectEvaluationQuestion'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export interface IQuerySubjectEvaluationQuestions extends Partial<UseQueryOptions<IEvaluationQuestionResponse, AxiosError>> {
  subjectId: string
}
export const useGetSubjectEvaluationQuestions = ({ subjectId, ...props }: IQuerySubjectEvaluationQuestions) => {
  const query = useQuery<IEvaluationQuestionResponse, AxiosError>({
    queryKey: ['getSubjectEvaluationQuestions', subjectId],
    queryFn: () => getSubjectEvaluationQuestions(subjectId),
    ...props,
  })
  useQueryErrorToast(query.isError && query?.error?.status !== 404, query?.error?.message!)

  return query
}
