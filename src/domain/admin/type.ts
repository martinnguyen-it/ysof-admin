import {
  EAccountStatus,
  IPaginationAPI,
  IPaginationAPIParams,
  ISort,
} from '@/domain/common'

export interface IAdminInResponse {
  created_at: Date
  updated_at: Date
  email: string
  status: EAccountStatus
  roles: EAdminRole[]
  full_name: string
  holy_name: string
  phone_number?: string[]
  address?: IAddressAdmin
  date_of_birth?: string
  patronal_day?: string
  facebook?: string
  latest_season: number
  seasons: number[]
  avatar?: string
  id: string
}

export interface IAddressAdmin {
  current: string
  original: string
  diocese: string
}

export interface IListAdminInResponse {
  pagination: IPaginationAPI
  data: IAdminInResponse[]
}

export interface ICreateAdmin {
  email: string
  roles: EAdminRole[]
  full_name: string
  holy_name: string
  phone_number?: string[]
  address?: IAddressAdmin
  date_of_birth?: string
  facebook?: string
  patronal_day?: string
}

export interface IUpdateAdmin extends Partial<ICreateAdmin> {
  status?: EAccountStatus
}

export interface IUpdateMe extends Partial<Omit<ICreateAdmin, 'roles'>> {}

export interface IParamsGetListAdmin extends IPaginationAPIParams, ISort {
  search?: string
  season?: number
}

export enum EAdminRole {
  ADMIN = 'admin',
  BDH = 'bdh',
  BKT = 'bkt',
  BTT = 'btt',
  BKL = 'bkl',
  BHV = 'bhv',
  BHD = 'bhd',
}

export const EAdminRoleDetail: { [key in EAdminRole]: string } = {
  [EAdminRole.ADMIN]: 'Quản trị viên',
  [EAdminRole.BDH]: 'Ban điều hành',
  [EAdminRole.BKT]: 'Ban kỹ thuật',
  [EAdminRole.BTT]: 'Ban truyền thông',
  [EAdminRole.BKL]: 'Ban kỷ luật',
  [EAdminRole.BHV]: 'Ban học vụ',
  [EAdminRole.BHD]: 'Ban hoạt động',
}

export interface IAdminShort {
  id: string
  full_name: string
  avatar: string
  active: boolean
}
