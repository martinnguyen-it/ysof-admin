import { useMutation } from '@tanstack/react-query'
import {
  ICreateSubject,
  IGenerateQuestionSpreadsheet,
  IUpdateSubject,
} from '@/domain/subject'
import {
  createSubject,
  deleteSubject,
  generateQuestionSpreadsheet,
  subjectSendEvaluation,
  subjectSendNotification,
  updateSubject,
} from '@/services/subject'
import { toast } from 'react-toastify'

export const useCreateSubject = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateSubject) => createSubject(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateSubject = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (payload: { subjectId: string; data: IUpdateSubject }) =>
      updateSubject(payload.subjectId, payload.data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteSubject = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (subjectId: string) => deleteSubject(subjectId),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useSubjectSendNotification = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: { subjectId: string; extra_emails: string[] }) =>
      subjectSendNotification(payload.subjectId, payload.extra_emails),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useSubjectSendEvaluation = () =>
  useMutation({
    mutationFn: (subjectId: string) => subjectSendEvaluation(subjectId),
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useGenerateQuestionSpreadsheet = (
  onSuccess: (data: IGenerateQuestionSpreadsheet) => void
) =>
  useMutation({
    mutationFn: (subjectId: string) => generateQuestionSpreadsheet(subjectId),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
