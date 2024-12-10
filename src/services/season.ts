import { del, get, post, put } from './HTTPService'
import { API_LIST } from '@constants/index'
import { ICreateSeason, IPaginationAPIParams, ISort, IUpdateSeason } from '@domain/common'
import { ISeasonResponse } from '@domain/season'

export const getListSeasons = async (params?: IPaginationAPIParams & ISort): Promise<ISeasonResponse[]> => get(API_LIST.season, { params })

export const createSeason = async (data: ICreateSeason): Promise<ISeasonResponse> => post(API_LIST.season, data)

export const getCurrentSeason = async (): Promise<ISeasonResponse> => get(API_LIST.season + '/current')

export const getSeasonById = async (id: string): Promise<ISeasonResponse> => get(API_LIST.season + '/' + id)

export const updateSeason = async (id: string, data: IUpdateSeason): Promise<ISeasonResponse> => put(API_LIST.season + '/' + id, data)

export const delSeasonById = async (id: string): Promise<ISeasonResponse> => del(API_LIST.season + '/' + id)

export const markSeasonCurrent = async (id: string): Promise<ISeasonResponse> => del(API_LIST.season + `/${id}/current`)
