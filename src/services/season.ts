import { del, get, post, put } from './HTTPService'
import { API_LIST } from '@constants/index'
import { ICreateSeason, IPaginationAPIParams, ISort, IUpdateSeason } from '@domain/common'
import { ISeasonResponse } from '@domain/season'

export const getListSeasons = async (params?: IPaginationAPIParams & ISort): Promise<ISeasonResponse[]> => {
  const response = await get({
    url: API_LIST.season,
    data: params,
  })
  return response?.data
}

export const createSeason = async (data: ICreateSeason): Promise<ISeasonResponse> => {
  const response = await post({
    url: API_LIST.season,
    data,
  })
  return response?.data
}

export const getCurrentSeason = async (): Promise<ISeasonResponse> => {
  const response = await get({
    url: API_LIST.season + '/current',
  })
  return response?.data
}

export const getSeasonById = async (id: string): Promise<ISeasonResponse> => {
  const response = await get({
    url: API_LIST.season + '/' + id,
  })
  return response?.data
}

export const updateSeason = async (id: string, data: IUpdateSeason): Promise<ISeasonResponse> => {
  const response = await put({
    url: API_LIST.season + '/' + id,
    data,
  })
  return response?.data
}

export const delSeasonById = async (id: string): Promise<ISeasonResponse> => {
  const response = await del({
    url: API_LIST.season + '/' + id,
  })
  return response?.data
}

export const markSeasonCurrent = async (id: string): Promise<ISeasonResponse> => {
  const response = await del({
    url: API_LIST.season + `/${id}/current`,
  })
  return response?.data
}
