export interface IEvaluationQuestionItem {
  title: string
  type: EEvaluationQuestionType
  answers?: string[]
}

export interface IEvaluationQuestionPayload {
  questions: IEvaluationQuestionItem[]
}

export interface IEvaluationQuestionResponse extends IEvaluationQuestionPayload {
  questions: IEvaluationQuestionItem[]
  id: string
  created_at: Date
  updated_at: Date
}

export enum EEvaluationQuestionType {
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}
