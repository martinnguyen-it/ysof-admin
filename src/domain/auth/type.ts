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
