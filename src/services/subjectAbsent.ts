import { get } from './HTTPService'
import { API_LIST } from '@constants/index'
import { ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'

export const getListSubjectAbsents = async (subjectId: string): Promise<ISubjectAbsentInResponse[]> => {
  const response = await get({
    url: API_LIST.subjectAbsent + '/list/' + subjectId,
  })
  return response?.data
}
