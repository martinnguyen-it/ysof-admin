import { ICreateLecturer, ILecturerInResponse, IListLecturerInResponse, IParamsGetListLecturer, IUpdateLecturer } from '@domain/lecturer'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListLecturers = async (params?: IParamsGetListLecturer): Promise<IListLecturerInResponse> => {
  const response = await get({
    url: API_LIST.lecturer,
    data: params,
  })
  return response?.data
}

export const getLecturerDetail = async (id: string): Promise<ILecturerInResponse> => {
  const response = await get({
    url: API_LIST.lecturer + '/' + id,
  })
  return response?.data
}

export const createLecturer = async (data: ICreateLecturer): Promise<ILecturerInResponse> => {
  const response = await post({
    url: API_LIST.lecturer,
    data,
  })
  return response?.data
}

export const updateLecturer = async (id: string, data: IUpdateLecturer): Promise<ILecturerInResponse> => {
  const response = await put({
    url: API_LIST.lecturer + '/' + id,
    data,
  })
  return response?.data
}

export const deleteLecturer = async (id: string): Promise<ILecturerInResponse> => {
  const response = await del({
    url: API_LIST.lecturer + '/' + id,
  })
  return response?.data
}
