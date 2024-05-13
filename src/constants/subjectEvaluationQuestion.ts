import { EEvaluationQuestionType } from '@domain/subjectEvaluationQuestion'
import { startCase } from 'lodash'

export const OPTIONS_EVALUATION_QUESTION_TYPES = Object.values(EEvaluationQuestionType).map((val) => ({
  value: val,
  label: startCase(val),
}))
