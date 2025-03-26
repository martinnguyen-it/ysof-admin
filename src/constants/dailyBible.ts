import { ELiturgicalSeason } from '@/domain/dailyBible'

export const LiturgicalSeasonColors: { [key in ELiturgicalSeason]: string } = {
  [ELiturgicalSeason.ADVENT]: '#9b59b6',
  [ELiturgicalSeason.CHRISTMAS]: '#bdc3c7',
  [ELiturgicalSeason.ORDINARY_TIME]: '#2ecc71',
  [ELiturgicalSeason.LENT]: '#9b59b6',
  [ELiturgicalSeason.EASTER]: '#bdc3c7',
}
