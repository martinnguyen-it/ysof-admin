import { IStudentInResponse } from '@domain/student'
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
}

export interface ICreateSubjectAbsent {
  reason?: string
  note?: string
}

export interface IUpdateSubjectAbsent extends ICreateSubjectAbsent {}
