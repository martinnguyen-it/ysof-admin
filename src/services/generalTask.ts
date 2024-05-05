import { ICreateGeneralTask, IGeneralTaskInResponse, IListGeneralTaskInResponse, IParamsGetListGeneralTask, IUpdateGeneralTask } from '@domain/generalTask'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListGeneralTasks = async (params?: IParamsGetListGeneralTask): Promise<IListGeneralTaskInResponse> => {
  const response = await get({
    url: API_LIST.generalTask,
    data: params,
  })
  return response?.data
}

export const getGeneralTaskDetail = async (id: string): Promise<IGeneralTaskInResponse> => {
  const response = await get({
    url: API_LIST.generalTask + '/' + id,
  })
  return response?.data
}

export const createGeneralTask = async (data: ICreateGeneralTask): Promise<IGeneralTaskInResponse> => {
  const response = await post({
    url: API_LIST.generalTask,
    data,
  })
  return response?.data
}

export const updateGeneralTask = async (id: string, data: IUpdateGeneralTask): Promise<IGeneralTaskInResponse> => {
  const response = await put({
    url: API_LIST.generalTask + '/' + id,
    data,
  })
  return response?.data
}

export const deleteGeneralTask = async (id: string): Promise<IGeneralTaskInResponse> => {
  const response = await del({
    url: API_LIST.generalTask + '/' + id,
  })
  return response?.data
}
