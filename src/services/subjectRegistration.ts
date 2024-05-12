import { get } from './HTTPService'
import { API_LIST } from '@constants/index'
import { IManySubjectRegistrationInResponse, IParamsGetListSubjectRegistration, IStudentInSubject } from '@domain/subject/subjectRegistration'

export const getListSubjectRegistrations = async (params?: IParamsGetListSubjectRegistration): Promise<IManySubjectRegistrationInResponse> => {
  const response = await get({
    url: API_LIST.subjectRegistration,
    data: params,
  })
  return response?.data
}

export const getListSubjectRegistrationsBySubjectId = async (subject_id: string): Promise<IStudentInSubject[]> => {
  const response = await get({
    url: API_LIST.subjectRegistration + '/subject/' + subject_id,
  })
  return response?.data
}
