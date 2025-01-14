import { selectSeasonState } from '@atom/seasonAtom'
import { IParamsGetListSubject, ISubjectInResponse, ISubjectShortInResponse } from '@domain/subject'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getListSubjects, getSubjectDetail, getSubjectLastSentStudentRecent, getSubjectNextMostRecent, getSubjectShort } from '@src/services/subject'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRecoilValue } from 'recoil'

export const useGetListSubjects = (params?: IParamsGetListSubject) => {
  const season = useRecoilValue(selectSeasonState)
  const query = useQuery<ISubjectInResponse[], AxiosError>({
    queryKey: ['getListSubjects', params, season],
    // if params exist season, will overwrite season select
    queryFn: () => getListSubjects({ season, ...params }),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export interface IQueryGetSubjectDetail extends Partial<UseQueryOptions<ISubjectInResponse, AxiosError>> {
  id: string
}
export const useGetSubjectDetail = ({ id, ...props }: IQueryGetSubjectDetail) => {
  const query = useQuery<ISubjectInResponse, AxiosError>({
    queryKey: ['getSubjectDetail', id],
    queryFn: () => getSubjectDetail(id),
    ...props,
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetSubjectNextMostRecent = (enabled = true) => {
  const query = useQuery<ISubjectInResponse, AxiosError>({
    queryKey: ['getSubjectNextMostRecent'],
    queryFn: () => getSubjectNextMostRecent(),
    enabled,
  })
  useQueryErrorToast(query.isError && query?.error?.status !== 404, query?.error?.message!)

  return query
}

export const useGetSubjectLastSentStudentRecent = () => {
  const query = useQuery<ISubjectInResponse, AxiosError>({
    queryKey: ['getSubjectLastSentStudentRecent'],
    queryFn: () => getSubjectLastSentStudentRecent(),
  })
  useQueryErrorToast(query.isError && query?.error?.status !== 404, query?.error?.message!)

  return query
}

export const useGetSubjectShort = (params?: IParamsGetListSubject) => {
  const season = useRecoilValue(selectSeasonState)
  const query = useQuery<ISubjectShortInResponse[], AxiosError>({
    queryKey: ['getSubjectShort', params, season],
    queryFn: () => getSubjectShort({ season, ...params }),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
