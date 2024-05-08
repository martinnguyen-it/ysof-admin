import { IAdminInResponse, ICreateAdmin, IListAdminInResponse, IParamsGetListAdmin, IUpdateAdmin, IUpdateMe } from '@domain/admin/type'
import { del, get, post, put } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getMe = async (): Promise<IAdminInResponse> => {
  const response = await get({
    url: API_LIST.me,
  })
  return response?.data
}

export const getListAdmins = async (params?: IParamsGetListAdmin): Promise<IListAdminInResponse> => {
  const response = await get({
    url: API_LIST.admin,
    data: params,
  })
  return response?.data
}

export const getAdminDetail = async (id: string): Promise<IAdminInResponse> => {
  const response = await get({
    url: API_LIST.admin + '/' + id,
  })
  return response?.data
}

export const createAdmin = async (data: ICreateAdmin): Promise<IAdminInResponse> => {
  const response = await post({
    url: API_LIST.admin,
    data,
  })
  return response?.data
}

export const updateAdmin = async (id: string, data: IUpdateAdmin): Promise<IAdminInResponse> => {
  const response = await put({
    url: API_LIST.admin + '/' + id,
    data,
  })
  return response?.data
}

export const updateAdminMe = async (data: IUpdateMe): Promise<IAdminInResponse> => {
  const response = await put({
    url: API_LIST.me,
    data,
  })
  return response?.data
}

export const deleteAdmin = async (id: string): Promise<IAdminInResponse> => {
  const response = await del({
    url: API_LIST.admin + '/' + id,
  })
  return response?.data
}
