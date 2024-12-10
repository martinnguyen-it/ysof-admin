import { IChangePassword, ILoginRequest, ILoginResponse } from '@domain/auth/type'
import { post, put } from './HTTPService'
import { API_LIST } from '@constants/index'

export const APILogin = ({ email, password }: ILoginRequest): Promise<ILoginResponse> => post(API_LIST.auth.login, { email, password })

export const updatePassword = (data: IChangePassword): Promise<ILoginResponse> => put(API_LIST.auth.changePassword, data)
