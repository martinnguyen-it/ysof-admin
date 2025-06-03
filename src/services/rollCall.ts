import {
  IParamsGetListRollCallResult,
  IRollCallPayload,
  IRollCallResultInResponse,
} from '@/domain/rollCall'
import { get, post } from './HTTPService'

export const getListRollCallResults = (
  params?: IParamsGetListRollCallResult
): Promise<IRollCallResultInResponse> =>
  get('/api/v1/roll-call/results', { params })

export const rollCall = (data: IRollCallPayload): Promise<boolean> =>
  post('/api/v1/roll-call/by-sheet', data)
