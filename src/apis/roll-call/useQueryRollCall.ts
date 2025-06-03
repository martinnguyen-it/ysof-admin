import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { selectSeasonState } from '@/atom/seasonAtom'
import { IRollCallResultInResponse } from '@/domain/rollCall'
import { IParamsGetListRollCallResult } from '@/domain/rollCall'
import { getListRollCallResults } from '@/services/rollCall'
import { useRecoilValue } from 'recoil'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListRollCallResult = (
  params?: Omit<IParamsGetListRollCallResult, 'season'>
) => {
  const season = useRecoilValue(selectSeasonState)
  const query = useQuery<IRollCallResultInResponse, AxiosError>({
    queryKey: ['getListRollCallResult', params, season],
    queryFn: () => getListRollCallResults({ season, ...params }),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
