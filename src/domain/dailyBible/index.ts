export enum ELiturgicalSeason {
  ADVENT = 'Mùa Vọng',
  CHRISTMAS = 'Mùa Giáng Sinh',
  ORDINARY_TIME = 'Mùa Thường Niên',
  LENT = 'Mùa Chay',
  EASTER = 'Mùa Phục Sinh',
}

export interface IDailyBibleQuotesInResponse {
  gospel_ref: string
  epitomize_text: string
  season: ELiturgicalSeason
}
