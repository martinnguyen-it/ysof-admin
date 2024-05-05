import { EAdminRole, IAdminShort } from '@domain/admin/type'
import { IPaginationAPI, IPaginationAPIParams, ISort } from '@domain/common'

export interface IDocumentInResponse {
  file_id: string
  mimeType?: string
  name: string
  role: EAdminRole
  type: EDocumentType
  description?: string
  label?: string[]
  id: string
  author: IAdminShort
  season: number
  created_at: Date
  updated_at: Date
  webViewLink: string
}

export interface IListDocumentInResponse {
  pagination: IPaginationAPI
  data: IDocumentInResponse[]
}

export interface ICreateDocumentBase {
  name: string
  type: EDocumentType
  description?: string
  role: EAdminRole
  label?: string[]
}

export interface ICreateDocumentWithFile {
  payload: ICreateDocumentBase
  file: File
}

export interface ICreateDocumentGoogle extends ICreateDocumentBase {
  google_type_file: EGoogleFileType
}

export interface IUpdateDocument {
  payload: Partial<ICreateDocumentBase>
  file?: File
}

export interface IParamsGetListDocument extends IPaginationAPIParams, ISort {
  search?: string
  label?: string[]
  roles?: EAdminRole[]
  season?: number
  type?: EDocumentType
}

export enum EDocumentType {
  ANNUAL = 'annual',
  COMMON = 'common',
  INTERNAL = 'internal',
  STUDENT = 'student',
}

export enum EGoogleFileType {
  SPREAD_SHEET = 'spread_sheet',
  DOCUMENT = 'document',
}
