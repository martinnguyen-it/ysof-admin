import { createFileRoute } from '@tanstack/react-router'
import ListSubjectEvaluationV from '@/views/subjectEvaluation/ListSubjectEvaluationV'

interface ISearchParams {
  subjectId?: string
  evaluationId?: string
}

export const Route = createFileRoute('/_authenticated/luong-gia/ket-qua')({
  component: ListSubjectEvaluationV,
  validateSearch: (search: Record<string, unknown>): ISearchParams => {
    return {
      subjectId: (search.subjectId as string) || undefined,
      evaluationId: (search.evaluationId as string) || undefined,
    }
  },
})
