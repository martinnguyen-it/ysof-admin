import { createLazyFileRoute } from '@tanstack/react-router'
import ManageSubjectEvaluationV from '@/views/subjectEvaluation/ManageSubjectEvaluationV'

export const Route = createLazyFileRoute(
  '/_authenticated/luong-gia/quan-ly-form'
)({
  component: ManageSubjectEvaluationV,
})
