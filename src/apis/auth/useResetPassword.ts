import { useMutation } from '@tanstack/react-query'
import { IVerifyOTP, IResetPasswordRequest } from '@/domain/auth/type'
import { forgotPassword, resetPassword, verifyOTP } from '@/services/auth'
import { toast } from 'react-toastify'

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: IResetPasswordRequest) =>
      resetPassword(data.token, data.new_password),
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useVerifyOTP = () =>
  useMutation({
    mutationFn: (data: IVerifyOTP) => verifyOTP(data),
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
