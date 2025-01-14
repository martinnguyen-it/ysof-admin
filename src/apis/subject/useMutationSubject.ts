import { ICreateSubject, IUpdateSubject } from '@domain/subject'
import { createSubject, deleteSubject, subjectSendEvaluation, subjectSendNotification, updateSubject } from '@src/services/subject'
import { useMutation } from '@tanstack/react-query'
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

export const useUpdateSubject = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: { subjectId: string; data: IUpdateSubject }) => updateSubject(payload.subjectId, payload.data),
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
    mutationFn: (subjectId: string) => subjectSendNotification(subjectId),
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
