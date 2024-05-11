import { IPaginationAPI, IPaginationAPIParams, ISort } from '@domain/common'

export interface IStudentInSubject {
  numerical_order: number
  group: number
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
}

export interface IParamsGetListSubjectRegistration extends ISort, IPaginationAPIParams {
  group?: number
  search?: string
}
