import { selectSeasonState } from '@atom/seasonAtom'
import { IListStudentInResponse, IParamsGetListStudent, IStudentInResponse } from '@domain/student'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getListStudents, getStudentDetail } from '@src/services/student'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { useRecoilValue } from 'recoil'

export const useGetListStudents = (params?: Omit<IParamsGetListStudent, 'season'>) => {
  const season = useRecoilValue(selectSeasonState)
  const query = useQuery<IListStudentInResponse, AxiosError>({
    queryKey: ['getListStudents', params, season],
    queryFn: () => getListStudents({ season, ...params }),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetStudentDetail = (id: string) => {
  const query = useQuery<IStudentInResponse, AxiosError>({
    queryKey: ['getStudentDetail', id],
    queryFn: () => getStudentDetail(id),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
