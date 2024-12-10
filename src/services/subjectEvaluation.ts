import { IManySubjectEvaluationInResponse, IParamsGetListSubjectEvaluation } from '@domain/subject/subjectEvaluation'
import { get } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListSubjectEvaluation = (params: IParamsGetListSubjectEvaluation): Promise<IManySubjectEvaluationInResponse> => get(API_LIST.subjectEvaluation, { params })
