import { IListAuditLogInResponse, IParamsGetListAuditLog } from '@domain/auditLog'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getListAuditLogs } from '@src/services/auditLog'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useGetListAuditLogs = (params?: IParamsGetListAuditLog) => {
  const query = useQuery<IListAuditLogInResponse, AxiosError>({
    queryKey: ['getListAuditLogs', params],
    queryFn: () => getListAuditLogs(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
