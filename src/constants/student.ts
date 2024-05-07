import { ESex } from '@domain/student'

export const OPTION_SEX = Object.values(ESex).map((value) => ({
  value,
  label: value,
}))
