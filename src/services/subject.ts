import { ICreateSubject, ISubjectInResponse, IParamsGetListSubject, IUpdateSubject, ISubjectShortInResponse } from '@domain/subject'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListSubjects = (params?: IParamsGetListSubject): Promise<ISubjectInResponse[]> => get(API_LIST.subject, { params })

export const getSubjectDetail = (id: string): Promise<ISubjectInResponse> => get(API_LIST.subject + '/' + id)

export const getSubjectNextMostRecent = (): Promise<ISubjectInResponse> => get(API_LIST.subject + '/next-most-recent')

export const getSubjectLastSentStudentRecent = (): Promise<ISubjectInResponse> => get(API_LIST.subject + '/last-sent-student')

export const getSubjectShort = (params?: IParamsGetListSubject): Promise<ISubjectShortInResponse[]> => get(API_LIST.subject + '/list-short', { params })

export const subjectSendNotification = (subjectId: string) => post(API_LIST.subjectSendNotification + '/' + subjectId)

export const subjectSendEvaluation = (subjectId: string) => post(API_LIST.subjectSendEvaluation + '/' + subjectId)

export const createSubject = (data: ICreateSubject): Promise<ISubjectInResponse> => post(API_LIST.subject, data)

export const updateSubject = (id: string, data: IUpdateSubject): Promise<ISubjectInResponse> => put(API_LIST.subject + '/' + id, data)

export const deleteSubject = (id: string): Promise<ISubjectInResponse> => del(API_LIST.subject + '/' + id)
