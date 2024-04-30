import { ILoginRequest, ILoginResponse } from '@domain/auth/type'
import { post } from './HTTPService'

export const APILogin = async ({ email, password }: ILoginRequest): Promise<ILoginResponse> => {
  const response = await post({
    url: '/api/v1/admin/auth/login',
    data: { email, password },
  })
  return response?.data
}
