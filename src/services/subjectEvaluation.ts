import {
  IManySubjectEvaluationInResponse,
  IParamsGetListSubjectEvaluation,
} from '@/domain/subject/subjectEvaluation'
import { API_LIST } from '@/constants/index'
import { get } from './HTTPService'

export const getListSubjectEvaluation = (
  params: IParamsGetListSubjectEvaluation
): Promise<IManySubjectEvaluationInResponse> =>
  get(API_LIST.subjectEvaluation, { params })
