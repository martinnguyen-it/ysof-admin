import { ILoginRequest, ILoginResponse } from '@domain/auth/type'
import { post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const APILogin = async ({ email, password }: ILoginRequest): Promise<ILoginResponse> => {
  const response = await post({
    url: API_LIST.auth.login,
    data: { email, password },
  })
  return response?.data
}
