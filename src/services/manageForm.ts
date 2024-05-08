import { get, post } from './HTTPService'
import { API_LIST } from '@constants/index'
import { EManageFormType, IManageFormInPayload, IManageFormInResponse } from '@domain/manageForm'

export const getManageForm = async (type: EManageFormType): Promise<IManageFormInResponse> => {
  const response = await get({
    url: API_LIST.manageForm,
    data: { type },
  })
  return response?.data
}

export const updateManageForm = async (data: IManageFormInPayload): Promise<IManageFormInResponse> => {
  const response = await post({
    url: API_LIST.manageForm,
    data,
  })
  return response?.data
}
