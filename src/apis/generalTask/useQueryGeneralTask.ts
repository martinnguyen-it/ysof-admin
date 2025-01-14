import { IGeneralTaskInResponse, IListGeneralTaskInResponse, IParamsGetListGeneralTask } from '@domain/generalTask'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getGeneralTaskDetail, getListGeneralTasks } from '@src/services/generalTask'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useGetListGeneralTasks = (params?: IParamsGetListGeneralTask) => {
  const query = useQuery<IListGeneralTaskInResponse, AxiosError>({
    queryKey: ['getListGeneralTasks', params],
    queryFn: () => getListGeneralTasks(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetGeneralTaskDetail = (id: string) => {
  const query = useQuery<IGeneralTaskInResponse, AxiosError>({
    queryKey: ['getGeneralTaskDetail', id],
    queryFn: () => getGeneralTaskDetail(id),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
