import {
  IManySubjectRegistrationInResponse,
  IParamsGetListSubjectRegistration,
  IStudentInSubject,
} from '@/domain/subject/subjectRegistration'
import { API_LIST } from '@/constants/index'
import { get } from './HTTPService'

export const getListSubjectRegistrations = (
  params?: IParamsGetListSubjectRegistration
): Promise<IManySubjectRegistrationInResponse> =>
  get(API_LIST.subjectRegistration, { params })

export const getListSubjectRegistrationsBySubjectId = (
  subjectId: string
): Promise<IStudentInSubject[]> =>
  get(API_LIST.subjectRegistration + '/subject/' + subjectId)
