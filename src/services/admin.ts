import {
  IAdminInResponse,
  ICreateAdmin,
  IListAdminInResponse,
  IParamsGetListAdmin,
  IUpdateAdmin,
  IUpdateMe,
} from '@/domain/admin/type'
import { API_LIST } from '@/constants/index'
import { del, get, post, put } from './HTTPService'

export const getMe = (): Promise<IAdminInResponse> => get(API_LIST.me)

export const getListAdmins = (
  params?: IParamsGetListAdmin
): Promise<IListAdminInResponse> => get(API_LIST.admin, { params })

export const getAdminDetail = (id: string): Promise<IAdminInResponse> =>
  get(API_LIST.admin + '/' + id)

export const createAdmin = (data: ICreateAdmin): Promise<IAdminInResponse> =>
  post(API_LIST.admin, data)

export const updateAdmin = (
  id: string,
  data: IUpdateAdmin
): Promise<IAdminInResponse> => put(API_LIST.admin + '/' + id, data)

export const updateAdminMe = (data: IUpdateMe): Promise<IAdminInResponse> =>
  put(API_LIST.me, data)

export const deleteAdmin = (id: string): Promise<IAdminInResponse> =>
  del(API_LIST.admin + '/' + id)

export const updateAvatar = (file: File): Promise<IAdminInResponse> => {
  const formData = new FormData()
  formData.append('image', file)
  return put(API_LIST.updateAvatar, formData)
}
