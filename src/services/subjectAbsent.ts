import { del, get, patch, post } from './HTTPService'
import { API_LIST } from '@constants/index'
import { ICreateSubjectAbsent, ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'

export const getListSubjectAbsents = async (subjectId: string): Promise<ISubjectAbsentInResponse[]> => {
  const response = await get({
    url: API_LIST.subjectAbsent + '/' + subjectId,
  })
  return response?.data
}

export const createSubjectAbsents = async (subjectId: string, studentId: string, data: ICreateSubjectAbsent): Promise<ISubjectAbsentInResponse> => {
  const response = await post({
    url: API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`,
    data,
  })
  return response?.data
}

export const updateSubjectAbsents = async (subjectId: string, studentId: string, data: ICreateSubjectAbsent): Promise<ISubjectAbsentInResponse> => {
  const response = await patch({
    url: API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`,
    data,
  })
  return response?.data
}

export const deleteSubjectAbsents = async (subjectId: string, studentId: string) => {
  const response = await del({
    url: API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`,
  })
  return response?.data
}
