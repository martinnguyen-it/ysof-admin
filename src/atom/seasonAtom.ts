import { ISeasonResponse } from '@domain/season'
import { atom } from 'recoil'

export const currentSeasonState = atom<ISeasonResponse>({
  key: 'currentSeason',
  default: undefined,
})

export const selectSeasonState = atom<number>({
  key: 'selectSeason',
  default: undefined,
})
