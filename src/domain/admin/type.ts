import { EAccountStatus } from '@domain/common'

export interface IAdmin {
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
  facebook?: string
  current_season: number
  seasons: number[]
  avatar?: string
  id: string
}

export interface IAddressAdmin {
  current: string
  original: string
  diocese: string
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
