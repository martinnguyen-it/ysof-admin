import { ICreateSubject, ISubjectInResponse, IParamsGetListSubject, IUpdateSubject } from '@domain/subject'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListSubjects = async (params?: IParamsGetListSubject): Promise<ISubjectInResponse[]> => {
  const response = await get({
    url: API_LIST.subject,
    data: params,
  })
  return response?.data
}

export const getSubjectDetail = async (id: string): Promise<ISubjectInResponse> => {
  const response = await get({
    url: API_LIST.subject + '/' + id,
  })
  return response?.data
}

export const getSubjectNextMostRecent = async (): Promise<ISubjectInResponse & { message?: string }> => {
  const response = await get({
    url: API_LIST.subject + '/next-most-recent',
  })
  return response?.data
}

export const getSubjectLastSentStudentRecent = async (): Promise<ISubjectInResponse & { message?: string }> => {
  const response = await get({
    url: API_LIST.subject + '/last-sent-student',
  })
  return response?.data
}

export const subjectSendNotification = async (subjectId: string) => {
  const response = await post({
    url: API_LIST.subjectSendNotification + '/' + subjectId,
  })
  return response?.data
}

export const createSubject = async (data: ICreateSubject): Promise<ISubjectInResponse> => {
  const response = await post({
    url: API_LIST.subject,
    data,
  })
  return response?.data
}

export const updateSubject = async (id: string, data: IUpdateSubject): Promise<ISubjectInResponse> => {
  const response = await put({
    url: API_LIST.subject + '/' + id,
    data,
  })
  return response?.data
}

export const deleteSubject = async (id: string): Promise<ISubjectInResponse> => {
  const response = await del({
    url: API_LIST.subject + '/' + id,
  })
  return response?.data
}
