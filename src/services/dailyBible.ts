import { IDailyBibleQuotesInResponse } from '@/domain/dailyBible'
import { API_LIST } from '@/constants/index'
import { get } from './HTTPService'

export const getDailyBibleQuotes = (): Promise<IDailyBibleQuotesInResponse> => {
  return get(API_LIST.getDailyBibleQuotes)
}
