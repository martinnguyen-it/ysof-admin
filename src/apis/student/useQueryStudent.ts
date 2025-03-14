import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { selectSeasonState } from '@/atom/seasonAtom'
import {
  IListStudentInResponse,
  IParamsGetListStudent,
  IStudentInResponse,
} from '@/domain/student'
import { getListStudents, getStudentDetail } from '@/services/student'
import { useRecoilValue } from 'recoil'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListStudents = (
  params?: Omit<IParamsGetListStudent, 'season'>
) => {
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
