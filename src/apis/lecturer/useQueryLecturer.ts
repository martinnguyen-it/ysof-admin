import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import {
  ILecturerInResponse,
  IListLecturerInResponse,
  IParamsGetListLecturer,
} from '@/domain/lecturer'
import { getLecturerDetail, getListLecturers } from '@/services/lecturer'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

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
