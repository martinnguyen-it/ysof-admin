import {
  IChangePassword,
  ILoginRequest,
  ILoginResponse,
  IVerifyOTP,
  IVerifyOTPResponse,
} from '@/domain/auth/type'
import { IBaseResponse } from '@/domain/common'
import { API_LIST } from '@/constants/index'
import { post, put } from './HTTPService'

export const APILogin = ({
  email,
  password,
}: ILoginRequest): Promise<ILoginResponse> => {
  const formData = new FormData()
  formData.append('username', email)
  formData.append('password', password)
  return post(API_LIST.auth.login, formData)
}

export const updatePassword = (
  data: IChangePassword
): Promise<ILoginResponse> => put(API_LIST.auth.changePassword, data)

export const forgotPassword = (email: string): Promise<IBaseResponse> =>
  post(API_LIST.auth.forgotPassword, { email })

export const verifyOTP = (data: IVerifyOTP): Promise<IVerifyOTPResponse> =>
  post(API_LIST.auth.verifyOTP, data)

export const resetPassword = (
  token: string,
  newPassword: string
): Promise<IBaseResponse> =>
  post(API_LIST.auth.resetPassword, { token, new_password: newPassword })
