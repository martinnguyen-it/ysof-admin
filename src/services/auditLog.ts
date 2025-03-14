import {
  IListAuditLogInResponse,
  IParamsGetListAuditLog,
} from '@/domain/auditLog'
import { API_LIST } from '@/constants/index'
import { get } from './HTTPService'

export const getListAuditLogs = (
  params?: IParamsGetListAuditLog
): Promise<IListAuditLogInResponse> => get(API_LIST.auditLog, { params })
