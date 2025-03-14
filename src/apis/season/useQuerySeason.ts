import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { IPaginationAPIParams, ISort } from '@/domain/common'
import { ISeasonResponse } from '@/domain/season'
import {
  getCurrentSeason,
  getListSeasons,
  getSeasonById,
} from '@/services/season'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListSeasons = (params?: IPaginationAPIParams & ISort) => {
  const query = useQuery<ISeasonResponse[], AxiosError>({
    queryKey: ['getListSeasons', params],
    queryFn: () => getListSeasons(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)
  return query
}

export const useGetCurrentSeason = (enabled = true) => {
  const query = useQuery<ISeasonResponse, AxiosError>({
    queryKey: ['getCurrentSeason'],
    queryFn: () => getCurrentSeason(),
    enabled,
  })
  useQueryErrorToast(query.isError, query?.error?.message!)
  return query
}
export const useGetSeasonById = (id: string) => {
  const query = useQuery<ISeasonResponse, AxiosError>({
    queryKey: ['getSeasonById', id],
    queryFn: () => getSeasonById(id),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)
  return query
}
