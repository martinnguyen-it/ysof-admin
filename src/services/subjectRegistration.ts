import {
  IManySubjectRegistrationInResponse,
  IParamsGetListSubjectRegistration,
  IStudentInSubject,
  ICreateSubjectRegistration,
  ISubjectRegistrationResponse,
} from '@/domain/subject/subjectRegistration'
import { API_LIST } from '@/constants/index'
import { get, post } from './HTTPService'

export const getListSubjectRegistrations = (
  params?: IParamsGetListSubjectRegistration
): Promise<IManySubjectRegistrationInResponse> =>
  get(API_LIST.subjectRegistration, { params })

export const getListSubjectRegistrationsBySubjectId = (
  subjectId: string,
  search?: string
): Promise<IStudentInSubject[]> =>
  get(API_LIST.subjectRegistration + '/subject/' + subjectId, {
    params: { search },
  })

export const createSubjectRegistration = (
  data: ICreateSubjectRegistration
): Promise<ISubjectRegistrationResponse> =>
  post(API_LIST.subjectRegistration, data)
