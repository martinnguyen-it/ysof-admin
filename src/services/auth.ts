import { IChangePassword, ILoginRequest, ILoginResponse } from '@domain/auth/type'
import { post, put } from './HTTPService'
import { API_LIST } from '@constants/index'

export const APILogin = async ({ email, password }: ILoginRequest): Promise<ILoginResponse> => {
  const response = await post({
    url: API_LIST.auth.login,
    data: { email, password },
  })
  return response?.data
}

export const updatePassword = async (data: IChangePassword): Promise<ILoginResponse> => {
  const response = await put({
    url: API_LIST.auth.changePassword,
    data,
  })
  return response?.data
}
