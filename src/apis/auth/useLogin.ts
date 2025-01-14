import { ILoginRequest, ILoginResponse } from '@domain/auth/type'
import { APILogin } from '@src/services/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useLogin = (onSuccess: (data: ILoginResponse) => void) =>
  useMutation({
    mutationFn: (payload: ILoginRequest) => APILogin(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
