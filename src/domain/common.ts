export interface IPaginationAPIParams {
  page_index?: number
  page_size?: number
}

export interface ISort {
  sort?: ESort
  sort_by?: string
}

export enum ESort {
  ASCE = 'ascend',
  DESC = 'descend',
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

export interface IPaginationAPI {
  total: number
  page_index: number
  total_pages: number
}
