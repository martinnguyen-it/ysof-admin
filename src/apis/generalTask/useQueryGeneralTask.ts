import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import {
  IGeneralTaskInResponse,
  IListGeneralTaskInResponse,
  IParamsGetListGeneralTask,
} from '@/domain/generalTask'
import {
  getGeneralTaskDetail,
  getListGeneralTasks,
} from '@/services/generalTask'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListGeneralTasks = (params?: IParamsGetListGeneralTask) => {
  const query = useQuery<IListGeneralTaskInResponse, AxiosError>({
    queryKey: ['getListGeneralTasks', params],
    queryFn: () => getListGeneralTasks(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetGeneralTaskDetail = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const query = useQuery<IGeneralTaskInResponse, AxiosError>({
    queryKey: ['getGeneralTaskDetail', id],
    queryFn: () => getGeneralTaskDetail(id),
    enabled: options?.enabled !== false && !!id,
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
