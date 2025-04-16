import {
  IListFailedTaskResponse,
  IParamsGetListIFailedTask,
} from '@/domain/failedTasks'
import { API_LIST } from '@/constants/index'
import { get, post } from './HTTPService'

export const getListFailedTask = (
  params?: IParamsGetListIFailedTask
): Promise<IListFailedTaskResponse> => get(API_LIST.failedTask, { params })

export const markResolvedFailedTasks = (payload: {
  task_ids: string[]
}): Promise<void> => post(API_LIST.markResolvedFailedTasks, payload)

export const undoMarkResolvedFailedTasks = (payload: {
  task_ids: string[]
}): Promise<void> => post(API_LIST.undoMarkResolvedFailedTasks, payload)
