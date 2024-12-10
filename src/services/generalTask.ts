import { ICreateGeneralTask, IGeneralTaskInResponse, IListGeneralTaskInResponse, IParamsGetListGeneralTask, IUpdateGeneralTask } from '@domain/generalTask'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListGeneralTasks = (params?: IParamsGetListGeneralTask): Promise<IListGeneralTaskInResponse> => get(API_LIST.generalTask, { params })

export const getGeneralTaskDetail = (id: string): Promise<IGeneralTaskInResponse> => get(API_LIST.generalTask + '/' + id)

export const createGeneralTask = (data: ICreateGeneralTask): Promise<IGeneralTaskInResponse> => post(API_LIST.generalTask, data)

export const updateGeneralTask = (id: string, data: IUpdateGeneralTask): Promise<IGeneralTaskInResponse> => put(API_LIST.generalTask + '/' + id, data)

export const deleteGeneralTask = (id: string): Promise<IGeneralTaskInResponse> => del(API_LIST.generalTask + '/' + id)
