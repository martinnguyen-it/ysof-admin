import { get, post } from './HTTPService'
import { API_LIST } from '@constants/index'
import { EManageFormType, IManageFormInPayload, IManageFormInResponse } from '@domain/manageForm'

export const getManageForm = (type: EManageFormType): Promise<IManageFormInResponse> => get(API_LIST.manageForm, { params: { type } })

export const updateManageForm = (data: IManageFormInPayload): Promise<IManageFormInResponse> => post(API_LIST.manageForm, data)
