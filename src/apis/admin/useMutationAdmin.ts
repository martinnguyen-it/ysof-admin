import { useMutation } from '@tanstack/react-query'
import { IAdminInResponse, ICreateAdmin, IUpdateMe } from '@/domain/admin/type'
import {
  createAdmin,
  deleteAdmin,
  updateAdmin,
  updateAdminMe,
} from '@/services/admin'
import { toast } from 'react-toastify'

export const useCreateAdmin = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateAdmin) => createAdmin(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateMe = (onSuccess: (data: IAdminInResponse) => void) =>
  useMutation({
    mutationFn: (data: IUpdateMe) => updateAdminMe(data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateAdmin = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: { id: string; data: ICreateAdmin }) =>
      updateAdmin(payload.id, payload.data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteAdmin = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
