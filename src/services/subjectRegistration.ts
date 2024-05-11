import { get } from './HTTPService'
import { API_LIST } from '@constants/index'
import { IManySubjectRegistrationInResponse, IParamsGetListSubjectRegistration } from '@domain/subject/subjectRegistration'

export const getListSubjectRegistrations = async (params?: IParamsGetListSubjectRegistration): Promise<IManySubjectRegistrationInResponse> => {
  const response = await get({
    url: API_LIST.subjectRegistration,
    data: params,
  })
  return response?.data
}
