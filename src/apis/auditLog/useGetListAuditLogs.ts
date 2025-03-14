import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import {
  IListAuditLogInResponse,
  IParamsGetListAuditLog,
} from '@/domain/auditLog'
import { getListAuditLogs } from '@/services/auditLog'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListAuditLogs = (params?: IParamsGetListAuditLog) => {
  const query = useQuery<IListAuditLogInResponse, AxiosError>({
    queryKey: ['getListAuditLogs', params],
    queryFn: () => getListAuditLogs(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
