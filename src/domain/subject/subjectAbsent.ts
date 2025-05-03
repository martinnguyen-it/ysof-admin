import { IStudentInResponse } from '@/domain/student'
import { ISubjectInEvaluation } from './subjectEvaluation'

export interface ISubjectAbsentInResponse {
  created_at: Date
  updated_at: Date
  id: string
  subject: ISubjectInEvaluation
  student: IStudentInResponse
  reason?: string
  note?: string
  status?: boolean
  created_by: ECreatedBy
  type: EAbsentType
}

export enum EAbsentType {
  NO_ATTEND = 'no_attend',
  NO_EVALUATION = 'no_evaluation',
}
export enum ECreatedBy {
  BTC = 'BTC',
  HV = 'HV',
}

export interface ICreateSubjectAbsent {
  reason?: string
  note?: string
  type: EAbsentType
}

export interface ICreateSubjectAbsentInPayload {
  subjectId: string
  studentId: string
  data: ICreateSubjectAbsent
}

export interface IUpdateSubjectAbsentInPayload
  extends Omit<ICreateSubjectAbsentInPayload, 'data'> {
  data: Partial<ICreateSubjectAbsent> & {
    status?: boolean
  }
}
