import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { selectSeasonState } from '@/atom/seasonAtom'
import {
  IManySubjectRegistrationInResponse,
  IParamsGetListSubjectRegistration,
  IStudentInSubject,
} from '@/domain/subject/subjectRegistration'
import {
  getListSubjectRegistrations,
  getListSubjectRegistrationsBySubjectId,
} from '@/services/subjectRegistration'
import { useRecoilValue } from 'recoil'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListSubjectRegistrations = (
  params: Omit<IParamsGetListSubjectRegistration, 'season'>
) => {
  const season = useRecoilValue(selectSeasonState)
  const query = useQuery<IManySubjectRegistrationInResponse, AxiosError>({
    queryKey: ['getListSubjectRegistration', params, season],
    queryFn: () => getListSubjectRegistrations({ season, ...params }),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetListSubjectRegistrationsBySubjectId = (
  subjectId: string
) => {
  const query = useQuery<IStudentInSubject[], AxiosError>({
    queryKey: ['getListSubjectRegistrationsBySubjectId', subjectId],
    queryFn: () => getListSubjectRegistrationsBySubjectId(subjectId),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
