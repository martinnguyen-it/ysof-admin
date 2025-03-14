import { useMutation } from '@tanstack/react-query'
import {
  ICreateSubjectAbsentInPayload,
  IUpdateSubjectAbsentInPayload,
} from '@/domain/subject/subjectAbsent'
import {
  createSubjectAbsents,
  deleteSubjectAbsents,
  updateSubjectAbsents,
} from '@/services/subjectAbsent'
import { toast } from 'react-toastify'

export const useCreateSubjectAbsents = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateSubjectAbsentInPayload) =>
      createSubjectAbsents(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateSubjectAbsents = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: IUpdateSubjectAbsentInPayload) =>
      updateSubjectAbsents(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteSubjectAbsents = (onSuccess: () => void) =>
  useMutation({
    mutationFn: ({
      subjectId,
      studentId,
    }: {
      subjectId: string
      studentId: string
    }) => deleteSubjectAbsents(subjectId, studentId),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
