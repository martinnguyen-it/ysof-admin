import { IListAuditLogInResponse, IParamsGetListAuditLog } from '@domain/auditLog'
import { get } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListAuditLogs = (params?: IParamsGetListAuditLog): Promise<IListAuditLogInResponse> => get(API_LIST.auditLog, { params })
