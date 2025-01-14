import { EAdminRole, IAdminInResponse } from '@domain/admin/type'
import { IPaginationAPI, IPaginationAPIParams, ISort } from '@domain/common'

export interface IAuditLogInResponse {
  type: EAuditLogType
  endpoint: EAuditLogEndPoint
  author_name: string
  author_email: string
  author_roles: EAdminRole[]
  description?: string
  id: string
  author?: IAdminInResponse
  season: number
  created_at: Date
}

export interface IListAuditLogInResponse {
  pagination: IPaginationAPI
  data: IAuditLogInResponse[]
}

export interface IParamsGetListAuditLog extends IPaginationAPIParams, ISort {
  search?: string
  type?: EAuditLogType
  endpoint?: EAuditLogEndPoint
  season?: number
}

export enum EAuditLogType {
  DELETE = 'delete',
  UPDATE = 'update',
  CREATE = 'create',
  IMPORT = 'import',
}

export enum EAuditLogEndPoint {
  ADMIN = 'admin',
  AUTH = 'auth',
  DOCUMENT = 'document',
  GENERAL_TASK = 'general_task',
  LECTURER = 'lecturer',
  SEASON = 'season',
  SUBJECT = 'subject',
  SUBJECT_EVALUATION_QUESTION = 'subject_evaluation_questions',
  UPLOAD = 'upload',
  STUDENT = 'student',
  MANAGE_FORM = 'manage_form',
  ABSENT = 'absent',
}
