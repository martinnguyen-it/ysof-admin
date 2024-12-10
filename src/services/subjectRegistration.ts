import { get } from './HTTPService'
import { API_LIST } from '@constants/index'
import { IManySubjectRegistrationInResponse, IParamsGetListSubjectRegistration, IStudentInSubject } from '@domain/subject/subjectRegistration'

export const getListSubjectRegistrations = (params?: IParamsGetListSubjectRegistration): Promise<IManySubjectRegistrationInResponse> =>
  get(API_LIST.subjectRegistration, { params })

export const getListSubjectRegistrationsBySubjectId = (subject_id: string): Promise<IStudentInSubject[]> => get(API_LIST.subjectRegistration + '/subject/' + subject_id)
