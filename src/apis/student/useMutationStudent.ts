import { useMutation } from '@tanstack/react-query'
import {
  ICreateStudent,
  IImportStudentFromSpreadSheetsRequest,
  IImportStudentFromSpreadSheetsResponse,
  IUpdateStudent,
} from '@/domain/student'
import {
  createStudent,
  deleteStudent,
  importStudent,
  resetPasswordStudent,
  updateStudent,
} from '@/services/student'
import { toast } from 'react-toastify'

export const useCreateStudent = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateStudent) => createStudent(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateStudent = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: { id: string; data: IUpdateStudent }) =>
      updateStudent(payload.id, payload.data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteStudent = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useImportStudent = (
  onSuccess: (data: IImportStudentFromSpreadSheetsResponse) => void
) =>
  useMutation({
    mutationFn: (data: IImportStudentFromSpreadSheetsRequest) =>
      importStudent(data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useResetPasswordStudent = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => resetPasswordStudent(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
