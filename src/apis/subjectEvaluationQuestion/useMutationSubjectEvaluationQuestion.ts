import { useMutation } from '@tanstack/react-query'
import { IEvaluationQuestionPayload } from '@/domain/subject/subjectEvaluationQuestion'
import { createSubjectEvaluationQuestion } from '@/services/subjectEvaluationQuestion'
import { toast } from 'react-toastify'

export const useCreateSubjectEvaluationQuestion = () =>
  useMutation({
    mutationFn: (payload: {
      subjectId: string
      data: IEvaluationQuestionPayload
    }) => createSubjectEvaluationQuestion(payload.subjectId, payload.data),
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
