import { get, post } from './HTTPService'
import { API_LIST } from '@constants/index'
import { IEvaluationQuestionPayload, IEvaluationQuestionResponse } from '@domain/subject/subjectEvaluationQuestion'

export const getSubjectEvaluationQuestions = (subjectId: string): Promise<IEvaluationQuestionResponse> => get(API_LIST.subjectEvaluationQuestions + '/' + subjectId)

export const createSubjectEvaluationQuestion = (subjectId: string, data: IEvaluationQuestionPayload): Promise<IEvaluationQuestionResponse> =>
  post(API_LIST.subjectEvaluationQuestions + '/' + subjectId, data)
