import { ISort, IPaginationAPIParams } from '@/domain/common'
import { EAbsentType } from '../subject/subjectAbsent'

export enum EResultRollCall {
  NO_COMPLETE = 'no_complete',
  COMPLETED = 'completed',
  ABSENT = 'absent',
}

export interface IRollCallSubjectInfo {
  attend_zoom: boolean
  evaluation: boolean
  absent_type: EAbsentType | null
  result: EResultRollCall
}

export interface IRollCallItemInResponse {
  id: string
  numerical_order: number
  holy_name: string
  full_name: string
  subjects: Record<string, IRollCallSubjectInfo>
  subject_completed: number
  subject_not_completed: number
  subject_registered: number
}

export interface IRollCallResultInResponse {
  data: IRollCallItemInResponse[]
  summary: Record<string, Record<string, number>>
}

export interface IParamsGetListRollCallResult
  extends ISort,
    IPaginationAPIParams {
  search?: string
  group?: number
  season?: number
}

export interface IRollCallPayload {
  url: string
  sheet_name: string
  subject_id: string
}
