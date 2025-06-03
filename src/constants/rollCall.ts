import { EResultRollCall } from '@/domain/rollCall'

export const EResultRollCallDetail: { [key in EResultRollCall]: string } = {
  [EResultRollCall.NO_COMPLETE]: 'KHT',
  [EResultRollCall.COMPLETED]: 'HT',
  [EResultRollCall.ABSENT]: 'P',
}
