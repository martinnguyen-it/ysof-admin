import { IPaginationAPI, IPaginationAPIParams, ISort } from '@domain/common'

export interface ILecturerInResponse {
  created_at: Date
  updated_at: Date
  title: string
  holy_name?: string
  full_name: string
  information?: string
  contact?: string
  id: string
  avatar?: string
  seasons?: number[]
}

export interface IListLecturerInResponse {
  pagination: IPaginationAPI
  data: ILecturerInResponse[]
}

export interface ICreateLecturer {
  title: string
  holy_name?: string
  full_name: string
  information?: string
  contact?: string
}

export interface IUpdateLecturer extends Partial<ICreateLecturer> {}

export interface IParamsGetListLecturer extends IPaginationAPIParams, ISort {
  search?: string
}
