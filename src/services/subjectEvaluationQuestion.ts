import { get, post } from './HTTPService'
import { API_LIST } from '@constants/index'
import { IEvaluationQuestionPayload, IEvaluationQuestionResponse } from '@domain/subject/subjectEvaluationQuestion'

export const getSubjectEvaluationQuestions = (subjectId: string): Promise<IEvaluationQuestionResponse> => get(API_LIST.subjectEvaluationQuestions + '/' + subjectId)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubjectEvaluationQuestionsNotHandler = (subjectId: string): Promise<IEvaluationQuestionResponse | undefined> => Promise.resolve(undefined)

export const createSubjectEvaluation = (subjectId: string, data: IEvaluationQuestionPayload): Promise<IEvaluationQuestionResponse> =>
  post(API_LIST.subjectEvaluationQuestions + '/' + subjectId, data)
