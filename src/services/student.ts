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

export const getListStudents = (params?: IParamsGetListStudent): Promise<IListStudentInResponse> => get(API_LIST.student, { params })

export const getStudentDetail = (id: string): Promise<IStudentInResponse> => get(API_LIST.student + '/' + id)

export const createStudent = (data: ICreateStudent): Promise<IStudentInResponse> => post(API_LIST.student, data)

export const updateStudent = (id: string, data: IUpdateStudent): Promise<IStudentInResponse> => put(API_LIST.student + '/' + id, data)

export const deleteStudent = (id: string): Promise<IStudentInResponse> => del(API_LIST.student + '/' + id)

export const importStudent = (data: IImportStudentFromSpreadSheetsRequest): Promise<IImportStudentFromSpreadSheetsResponse> => post(API_LIST.student + '/import', data)

export const resetPasswordStudent = (id: string): Promise<IResetPasswordResponse> => patch(API_LIST.student + '/reset-password/' + id)
