import { useMutation } from '@tanstack/react-query'
import { ICreateLecturer, IUpdateLecturer } from '@/domain/lecturer'
import {
  createLecturer,
  deleteLecturer,
  updateLecturer,
} from '@/services/lecturer'
import { toast } from 'react-toastify'

export const useCreateLecturer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateLecturer) => createLecturer(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateLecturer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: { id: string; data: IUpdateLecturer }) =>
      updateLecturer(payload.id, payload.data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteLecturer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => deleteLecturer(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
