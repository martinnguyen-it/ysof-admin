import { IPaginationAPI, IPaginationAPIParams, ISort } from '@domain/common'

export interface IQualityEvaluation {
  focused_right_topic: EQualityValue
  practical_content: EQualityValue
  benefit_in_life: EQualityValue
  duration: EQualityValue
  method: EQualityValue
}

export interface ISubjectEvaluationInResponse {
  created_at: Date
  updated_at: Date
  id: string
  subject: ISubjectInEvaluation
  quality: IQualityEvaluation
  most_resonated: string
  invited: string
  feedback_lecturer: string
  satisfied: number
  answers?: any[]
  feedback_admin?: string
  student: IStudentInEvaluation
}

export interface IManySubjectEvaluationInResponse {
  data: ISubjectEvaluationInResponse[]
  pagination: IPaginationAPI
}

export interface ILecturerInEvaluation {
  id: string
  title: string
  holy_name?: string
  full_name: string
}

export interface ISubjectInEvaluation {
  id: string
  title: string
  lecturer: ILecturerInEvaluation
  code: string
}

export interface IStudentInEvaluation {
  id: string
  group: number
  numerical_order: number
  holy_name: string
  full_name: string
  email: string
}

export enum EQualityValue {
  STRONGLY_DISAGREE = 'Hoàn toàn không đồng ý',
  DISAGREE = 'Không đồng ý',
  NEUTRAL = 'Trung lập',
  AGREE = 'Đồng ý',
  STRONGLY_AGREE = 'Hoàn toàn đồng ý',
}

export interface IParamsGetListSubjectEvaluation extends ISort, IPaginationAPIParams {
  group?: number
  search?: string
  subject_id: string
}
