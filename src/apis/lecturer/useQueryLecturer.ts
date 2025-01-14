import { ILecturerInResponse, IListLecturerInResponse, IParamsGetListLecturer } from '@domain/lecturer'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getLecturerDetail, getListLecturers } from '@src/services/lecturer'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useGetListLecturers = (params?: IParamsGetListLecturer) => {
  const query = useQuery<IListLecturerInResponse, AxiosError>({
    queryKey: ['getListLecturers', params],
    queryFn: () => getListLecturers(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetLecturerDetail = (id: string) => {
  const query = useQuery<ILecturerInResponse, AxiosError>({
    queryKey: ['getLecturerDetail', id],
    queryFn: () => getLecturerDetail(id),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
