import { EFailedTaskTag, EFailedTaskStatus } from '@/domain/failedTasks'
import { startCase } from 'lodash'

export const OPTIONS_FAILED_TASK_TAG = Object.values(EFailedTaskTag).map(
  (value) => ({ value, label: startCase(value) })
)
export const OPTIONS_FAILED_TASK_STATUS = Object.keys(EFailedTaskStatus).map(
  (key) => ({
    value: key,
    label: EFailedTaskStatus[key as keyof typeof EFailedTaskStatus],
  })
)
