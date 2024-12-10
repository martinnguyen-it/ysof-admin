import { del, get, patch, post } from './HTTPService'
import { API_LIST } from '@constants/index'
import { ICreateSubjectAbsent, ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'

export const getListSubjectAbsents = (subjectId: string): Promise<ISubjectAbsentInResponse[]> => get(API_LIST.subjectAbsent + '/' + subjectId)

export const createSubjectAbsents = (subjectId: string, studentId: string, data: ICreateSubjectAbsent): Promise<ISubjectAbsentInResponse> =>
  post(API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`, data)

export const updateSubjectAbsents = (subjectId: string, studentId: string, data: ICreateSubjectAbsent): Promise<ISubjectAbsentInResponse> =>
  patch(API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`, data)

export const deleteSubjectAbsents = (subjectId: string, studentId: string) => del(API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`)
