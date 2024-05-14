import { ISort } from '@domain/common'
import { IDocumentInResponse } from '@domain/document'
import { ILecturerInResponse } from '@domain/lecturer'

export interface ISubjectInResponse {
  created_at: Date
  updated_at: Date
  title: string
  start_at: string
  subdivision: string
  code: string
  question_url?: string
  abstract?: string
  zoom?: IZoomInfo
  documents_url?: string[]
  id: string
  lecturer: ILecturerInResponse
  season: number
  status: ESubjectStatus
  attachments: IDocumentInResponse[]
}

export interface ISubjectShortInResponse {
  title: string
  code: string
  id: string
}

export interface ICreateSubject {
  title: string
  start_at: string
  subdivision: string
  code: string
  question_url?: string
  zoom?: IZoomInfo
  documents_url?: string[]
  lecturer: string
  abstract?: string
}

export interface IUpdateSubject extends Partial<ICreateSubject> {}

export interface IParamsGetListSubject extends ISort {
  search?: string
  subdivision?: string
  season?: number
  status?: ESubjectStatus[]
}

export interface IZoomInfo {
  meeting_id?: number
  pass_code?: string
  link?: string
}

export enum ESubjectStatus {
  INIT = 'init',
  SENT_STUDENT = 'sent_student',
  SENT_EVALUATION = 'sent_evaluation',
  COMPLETED = 'completed',
}
