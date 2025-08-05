import { IPaginationAPI, IPaginationAPIParams, ISort } from '@/domain/common'
import { IStudentSeason } from '@/domain/student'

export interface IStudentInSubject {
  seasons_info: IStudentSeason[]
  holy_name: string
  full_name: string
  email: string
  id: string
}

export interface ISubjectRegistrationInResponse {
  student: IStudentInSubject
  total: number
  subject_registrations: string[]
}

export interface IManySubjectRegistrationInResponse {
  pagination: IPaginationAPI
  data: ISubjectRegistrationInResponse[]
  summary: Record<string, number>
}

export interface IParamsGetListSubjectRegistration
  extends ISort,
    IPaginationAPIParams {
  group?: number
  search?: string
  season?: number
}

export interface ICreateSubjectRegistration {
  student_id: string
  subjects: string[]
}

export interface ISubjectRegistrationResponse {
  student_id: string
  subjects_registration: string[]
}
