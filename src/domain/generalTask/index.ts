import { EAdminRole, IAdminShort } from '@/domain/admin/type'
import { IPaginationAPI, IPaginationAPIParams, ISort } from '@/domain/common'
import { IDocumentInResponse } from '@/domain/document'

export interface IGeneralTaskInResponse {
  created_at: Date
  updated_at: Date
  title: string
  short_desc?: string
  description: string
  start_at: string
  end_at?: string
  role: EAdminRole
  label?: string[]
  type: EGeneralTaskType
  id: string
  author: IAdminShort
  season: number
  attachments?: IDocumentInResponse[]
}

export interface IListGeneralTaskInResponse {
  pagination: IPaginationAPI
  data: IGeneralTaskInResponse[]
}

export interface ICreateGeneralTask {
  title: string
  short_desc?: string
  description: string
  start_at: string
  end_at: string
  role: string
  label?: string[]
  type: EGeneralTaskType
  attachments: string[]
}

export interface IUpdateGeneralTask extends Partial<ICreateGeneralTask> {}

export interface IAdminInGeneralTask {
  id: string
  full_name: string
  avatar: string
  active: boolean
}

export interface IParamsGetListGeneralTask extends IPaginationAPIParams, ISort {
  search?: string
  label?: string[]
  roles?: EAdminRole[]
  season?: number
  type?: EGeneralTaskType
}

export enum EGeneralTaskType {
  ANNUAL = 'annual',
  COMMON = 'common',
  INTERNAL = 'internal',
}
