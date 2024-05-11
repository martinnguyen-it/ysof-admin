import { IListAuditLogInResponse, IParamsGetListAuditLog } from '@domain/auditLog'
import { get } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListAuditLogs = async (params?: IParamsGetListAuditLog): Promise<IListAuditLogInResponse> => {
  const response = await get({
    url: API_LIST.auditLog,
    data: params,
  })
  return response?.data
}
