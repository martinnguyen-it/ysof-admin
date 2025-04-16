import { AxiosError } from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  IListFailedTaskResponse,
  IParamsGetListIFailedTask,
} from '@/domain/failedTasks'
import {
  getListFailedTask,
  markResolvedFailedTasks,
  undoMarkResolvedFailedTasks,
} from '@/services/failedTasks'
import { toast } from 'react-toastify'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListFailedTask = (params?: IParamsGetListIFailedTask) => {
  const query = useQuery<IListFailedTaskResponse, AxiosError>({
    queryKey: ['getListFailedTask', params],
    queryFn: () => getListFailedTask(params),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useMarkResolvedFailedTasks = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (payload: { task_ids: string[] }) =>
      markResolvedFailedTasks(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
}

export const useUndoMarkResolvedFailedTasks = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (payload: { task_ids: string[] }) =>
      undoMarkResolvedFailedTasks(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
}
