import {
  EAccountStatus,
  IPaginationAPI,
  IPaginationAPIParams,
  ISort,
} from '@/domain/common'

export interface IStudentSeason {
  numerical_order: number
  group: number
  season: number
}

export interface IStudentInResponse {
  created_at: Date
  updated_at: Date
  seasons_info: IStudentSeason[]
  holy_name: string
  full_name: string
  email: string
  sex?: ESex
  date_of_birth?: string
  origin_address?: string
  diocese?: string
  phone_number?: string
  avatar?: string
  education?: string
  job?: string
  note?: string
  id: string
  status: EAccountStatus
}
export interface IListStudentInResponse {
  pagination: IPaginationAPI
  data: IStudentInResponse[]
}

export interface ICreateStudent {
  numerical_order: number
  group: number
  holy_name: string
  full_name: string
  email: string
  sex?: ESex
  date_of_birth?: string
  origin_address?: string
  diocese?: string
  phone_number?: string
  avatar?: string
  education?: string
  job?: string
  note?: string
}

export interface IImportStudentFromSpreadSheetsRequest {
  url: string
  sheet_name: string
}

export interface IErrorInImportStudentFromSpreadSheet {
  row: number
  detail: string
}

export interface IAttentionInImportStudentFromSpreadSheet
  extends IErrorInImportStudentFromSpreadSheet {}

export interface IImportStudentFromSpreadSheetsResponse {
  inserteds: string[]
  errors: IErrorInImportStudentFromSpreadSheet[]
  attentions: IAttentionInImportStudentFromSpreadSheet[]
  updated: string[]
}

export interface IResetPasswordResponse {
  email: string
  password: string
}
export interface IUpdateStudent extends Partial<ICreateStudent> {}

export interface IParamsGetListStudent extends IPaginationAPIParams, ISort {
  search?: string
  group?: number
  season?: number
}

export enum ESex {
  MALE = 'Nam',
  FEMALE = 'Nữ',
}
