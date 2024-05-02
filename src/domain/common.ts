export interface IPaginationAPIParams {
  page_index?: number
  page_size?: number
}

export interface ISort {
  sort?: ESort
  sort_by?: string
}

export enum ESort {
  ASCE = 'asce',
  DESC = 'desc',
}

export interface ICreateSeason {
  title: string
  season: number
  description?: string
  academic_year: string
}

export interface IUpdateSeason extends Partial<ICreateSeason> {}

export interface IOpenForm<T> {
  active: boolean
  item?: T
}
