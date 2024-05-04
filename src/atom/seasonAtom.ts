import { ISeasonResponse } from '@domain/season'
import { atom } from 'recoil'

export const currentSeasonState = atom<ISeasonResponse>({
  key: 'currentSeason',
  default: undefined,
})
