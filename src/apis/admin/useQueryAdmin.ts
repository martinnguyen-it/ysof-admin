import { IAdminInResponse, IListAdminInResponse, IParamsGetListAdmin } from '@domain/admin/type'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getAdminDetail, getListAdmins, getMe } from '@src/services/admin'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useGetMe = () => {
  const query = useQuery<IAdminInResponse, AxiosError>({
    queryKey: ['getMe'],
    queryFn: () => getMe(),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetListAdmins = (params?: IParamsGetListAdmin) => {
  const query = useQuery<IListAdminInResponse, AxiosError>({
    queryKey: ['getListAdmins', params],
    queryFn: () => getListAdmins(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetAdminDetail = (id: string) => {
  const query = useQuery<IAdminInResponse, AxiosError>({
    queryKey: ['getAdminDetail', id],
    queryFn: () => getAdminDetail(id),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
