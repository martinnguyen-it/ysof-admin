import { IChangePassword, ILoginResponse } from '@domain/auth/type'
import { updatePassword } from '@src/services/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useUpdatePassword = (onSuccess: (data: ILoginResponse) => void) =>
  useMutation({
    mutationFn: (data: IChangePassword) => updatePassword(data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
