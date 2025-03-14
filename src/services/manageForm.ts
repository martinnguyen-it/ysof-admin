import {
  EManageFormType,
  IManageFormInPayload,
  IManageFormInResponse,
} from '@/domain/manageForm'
import { API_LIST } from '@/constants/index'
import { get, post } from './HTTPService'

export const getManageForm = (
  type: EManageFormType
): Promise<IManageFormInResponse> =>
  get(API_LIST.manageForm, { params: { type } })

export const updateManageForm = (
  data: IManageFormInPayload
): Promise<IManageFormInResponse> => post(API_LIST.manageForm, data)
