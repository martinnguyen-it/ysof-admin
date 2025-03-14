import { createLazyFileRoute } from '@tanstack/react-router'
import ListSubjectEvaluationV from '@/views/subjectEvaluation/ListSubjectEvaluationV'

export const Route = createLazyFileRoute('/_authenticated/luong-gia/ket-qua')({
  component: ListSubjectEvaluationV,
})
