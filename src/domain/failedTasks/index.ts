import { IPaginationAPI, IPaginationAPIParams, ISort } from '@/domain/common'

export interface IFailedTask {
  task_id: string
  tag: string
  name: string
  description: string
  traceback: string
  date_done: Date
  resolved: boolean
  updated_at: Date
}

export interface IListFailedTaskResponse {
  pagination: IPaginationAPI
  data: IFailedTask[]
}

export interface IParamsGetListIFailedTask extends IPaginationAPIParams, ISort {
  name?: string
  tag?: EFailedTaskTag
  resolved?: boolean
}

export enum EFailedTaskTag {
  Default = 'default',
  ManageFormPeriodic = 'manage_form_periodic',
  ManageForm = 'manage_form',
  SendMail = 'send_mail',
  DriveFile = 'drive_file',
}

export enum EFailedTaskStatus {
  true = 'Đã xử lý',
  false = 'Chưa xử lý',
}
