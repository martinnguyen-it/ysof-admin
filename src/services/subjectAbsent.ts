import {
  ICreateSubjectAbsentInPayload,
  ISubjectAbsentInResponse,
  IUpdateSubjectAbsentInPayload,
} from '@/domain/subject/subjectAbsent'
import { API_LIST } from '@/constants/index'
import { del, get, patch, post } from './HTTPService'

export const getListSubjectAbsents = (
  subjectId: string
): Promise<ISubjectAbsentInResponse[]> =>
  get(API_LIST.subjectAbsent + '/' + subjectId)

export const createSubjectAbsents = ({
  subjectId,
  studentId,
  data,
}: ICreateSubjectAbsentInPayload): Promise<ISubjectAbsentInResponse> =>
  post(
    API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`,
    data
  )

export const updateSubjectAbsents = ({
  subjectId,
  studentId,
  data,
}: IUpdateSubjectAbsentInPayload): Promise<ISubjectAbsentInResponse> =>
  patch(
    API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`,
    data
  )

export const deleteSubjectAbsents = (subjectId: string, studentId: string) =>
  del(API_LIST.subjectAbsent + `/subject/${subjectId}/student/${studentId}`)
