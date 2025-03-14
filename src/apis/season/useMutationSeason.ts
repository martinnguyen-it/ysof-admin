import { useMutation } from '@tanstack/react-query'
import { ICreateSeason } from '@/domain/common'
import { ISeasonResponse } from '@/domain/season'
import {
  createSeason,
  delSeasonById,
  markSeasonCurrent,
  updateSeason,
} from '@/services/season'
import { toast } from 'react-toastify'

export const useCreateSeason = (onSuccess: (data: ISeasonResponse) => void) =>
  useMutation({
    mutationFn: (payload: ICreateSeason) => createSeason(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateSeason = (onSuccess: (data: ISeasonResponse) => void) =>
  useMutation({
    mutationFn: (payload: { id: string; data: ICreateSeason }) =>
      updateSeason(payload.id, payload.data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteSeason = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => delSeasonById(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useMarkSeasonCurrent = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => markSeasonCurrent(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
