import { useMutation } from '@tanstack/react-query'
import { ICreateGeneralTask, IUpdateGeneralTask } from '@/domain/generalTask'
import {
  createGeneralTask,
  deleteGeneralTask,
  updateGeneralTask,
} from '@/services/generalTask'
import { toast } from 'react-toastify'

export const useCreateGeneralTask = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateGeneralTask) => createGeneralTask(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateGeneralTask = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: { id: string; data: IUpdateGeneralTask }) =>
      updateGeneralTask(payload.id, payload.data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteGeneralTask = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => deleteGeneralTask(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
