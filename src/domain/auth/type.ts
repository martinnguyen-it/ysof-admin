import { IAdminInResponse } from '../admin/type'

export interface ILoginRequest {
  email: string
  password: string
}
export interface IChangePassword {
  old_password: string
  new_password: string
}

export interface ILoginResponse {
  access_token: string
  user: IAdminInResponse
}

export interface IForgotPassword {
  email: string
}

export interface IVerifyOTP {
  email: string
  otp: string
}

export interface IResetPasswordRequest {
  token: string
  new_password: string
}

export interface IVerifyOTPResponse {
  reset_token: string
}
