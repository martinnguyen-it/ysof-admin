import { IManySubjectEvaluationInResponse, IParamsGetListSubjectEvaluation } from '@domain/subject/subjectEvaluation'
import { get } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListSubjectEvaluation = async (params: IParamsGetListSubjectEvaluation): Promise<IManySubjectEvaluationInResponse> => {
  const response = await get({
    url: API_LIST.subjectEvaluation,
    data: params,
  })
  return response?.data
}
