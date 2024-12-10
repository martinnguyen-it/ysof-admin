import { ICreateLecturer, ILecturerInResponse, IListLecturerInResponse, IParamsGetListLecturer, IUpdateLecturer } from '@domain/lecturer'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListLecturers = (params?: IParamsGetListLecturer): Promise<IListLecturerInResponse> => get(API_LIST.lecturer, { params })

export const getLecturerDetail = (id: string): Promise<ILecturerInResponse> => get(API_LIST.lecturer + '/' + id)

export const createLecturer = (data: ICreateLecturer): Promise<ILecturerInResponse> => post(API_LIST.lecturer, data)

export const updateLecturer = (id: string, data: IUpdateLecturer): Promise<ILecturerInResponse> => put(API_LIST.lecturer + '/' + id, data)

export const deleteLecturer = (id: string): Promise<ILecturerInResponse> => del(API_LIST.lecturer + '/' + id)
