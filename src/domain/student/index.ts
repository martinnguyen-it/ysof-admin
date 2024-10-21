import { EAccountStatus, IPaginationAPI, IPaginationAPIParams, ISort } from '@domain/common'

export interface IStudentInResponse {
  created_at: Date
  updated_at: Date
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
  id: string
  status: EAccountStatus
  latest_season: number
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

export interface IImportStudentFromSpreadSheetsResponse {
  inserted_ids: string[]
  errors: any[]
}

export interface IResetPasswordResponse {
  email: string
  password: string
}
export interface IUpdateStudent extends Partial<ICreateStudent> {}

export interface IParamsGetListStudent extends IPaginationAPIParams, ISort {
  search?: string
  group?: number
}

export enum ESex {
  MALE = 'Nam',
  FEMALE = 'Nữ',
}
