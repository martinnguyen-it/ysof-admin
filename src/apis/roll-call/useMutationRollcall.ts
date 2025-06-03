import { useMutation } from '@tanstack/react-query'
import { IRollCallPayload } from '@/domain/rollCall'
import { rollCall } from '@/services/rollCall'
import { toast } from 'react-toastify'

export const useRollCall = (onSuccess: (data: boolean) => void) =>
  useMutation({
    mutationFn: (data: IRollCallPayload) => rollCall(data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
