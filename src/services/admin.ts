import { IAdmin } from '@domain/admin/type'
import { get } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getMe = async (): Promise<IAdmin> => {
  const response = await get({
    url: API_LIST.getMe,
  })
  return response?.data
}
