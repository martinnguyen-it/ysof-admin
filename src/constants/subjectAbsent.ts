import { EAbsentType } from '@/domain/subject/subjectAbsent'

export const EAbsentTypeDetail: { [key in EAbsentType]: string } = {
  [EAbsentType.NO_ATTEND]: 'Nghỉ học',
  [EAbsentType.NO_EVALUATION]: 'Lượng giá',
}

export const OPTIONS_ABSENT_TYPE = Object.keys(EAbsentTypeDetail).map(
  (key) => ({
    value: key,
    label: EAbsentTypeDetail[key as EAbsentType],
  })
)
