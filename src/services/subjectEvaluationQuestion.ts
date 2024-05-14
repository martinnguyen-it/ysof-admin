import { get, post } from './HTTPService'
import { API_CONFIG, API_LIST } from '@constants/index'
import { getRecoil } from 'recoil-nexus'
import { accessTokenState } from '@atom/authAtom'
import axios from 'axios'
import { IEvaluationQuestionPayload, IEvaluationQuestionResponse } from '@domain/subjectEvaluationQuestion'

export const getSubjectEvaluationQuestions = async (subjectId: string): Promise<IEvaluationQuestionResponse> => {
  const response = await get({
    url: API_LIST.subjectEvaluationQuestions + '/' + subjectId,
  })
  return response?.data
}

export const getSubjectEvaluationQuestionsNotHandler = async (subjectId: string): Promise<IEvaluationQuestionResponse | undefined> => {
  const accessToken = getRecoil(accessTokenState)
  try {
    const response = await axios({
      method: 'get',
      url: API_CONFIG.HOST + API_LIST.subjectEvaluationQuestions + '/' + subjectId,
      headers: { Authorization: 'Bearer ' + accessToken },
    })
    return response?.data
  } catch (error) {
    return undefined
  }
}

export const createSubjectEvaluation = async (subjectId: string, data: IEvaluationQuestionPayload): Promise<IEvaluationQuestionResponse> => {
  const response = await post({
    url: API_LIST.subjectEvaluationQuestions + '/' + subjectId,
    data,
  })
  return response?.data
}
