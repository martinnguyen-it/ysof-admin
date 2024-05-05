import { EGeneralTaskType } from '@domain/generalTask'

export const EGeneralTaskTypeDetail: { [key in EGeneralTaskType]: string } = {
  [EGeneralTaskType.ANNUAL]: 'Hằng năm',
  [EGeneralTaskType.COMMON]: 'Trong năm',
  [EGeneralTaskType.INTERNAL]: 'Nội bộ ban',
}

export const OPTIONS_GENERAL_TASK_TYPE = Object.keys(EGeneralTaskTypeDetail).map((key) => ({
  value: key,
  label: EGeneralTaskTypeDetail[key as EGeneralTaskType],
}))

export const GENERAL_TASK_LABEL = ['Công việc đầu năm', 'Công việc tuyển sinh', 'Công việc chung']

export const OPTIONS_GENERAL_TASK_LABEL = GENERAL_TASK_LABEL.map((value) => ({
  value,
  label: value,
}))
