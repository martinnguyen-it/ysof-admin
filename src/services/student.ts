import {
  ICreateStudent,
  IStudentInResponse,
  IListStudentInResponse,
  IParamsGetListStudent,
  IUpdateStudent,
  IImportStudentFromSpreadSheetsRequest,
  IImportStudentFromSpreadSheetsResponse,
  IResetPasswordResponse,
} from '@domain/student'
import { del, get, put, post, patch } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListStudents = async (params?: IParamsGetListStudent): Promise<IListStudentInResponse> => {
  const response = await get({
    url: API_LIST.student,
    data: params,
  })
  return response?.data
}

export const getStudentDetail = async (id: string): Promise<IStudentInResponse> => {
  const response = await get({
    url: API_LIST.student + '/' + id,
  })
  return response?.data
}

export const createStudent = async (data: ICreateStudent): Promise<IStudentInResponse> => {
  const response = await post({
    url: API_LIST.student,
    data,
  })
  return response?.data
}

export const updateStudent = async (id: string, data: IUpdateStudent): Promise<IStudentInResponse> => {
  const response = await put({
    url: API_LIST.student + '/' + id,
    data,
  })
  return response?.data
}

export const deleteStudent = async (id: string): Promise<IStudentInResponse> => {
  const response = await del({
    url: API_LIST.student + '/' + id,
  })
  return response?.data
}

export const importStudent = async (data: IImportStudentFromSpreadSheetsRequest): Promise<IImportStudentFromSpreadSheetsResponse> => {
  const response = await post({
    url: API_LIST.student + '/import',
    data,
  })
  return response?.data
}

export const resetPasswordStudent = async (id: string): Promise<IResetPasswordResponse> => {
  const response = await patch({
    url: API_LIST.student + '/reset-password/' + id,
  })
  return response?.data
}
