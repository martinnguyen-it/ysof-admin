export interface IManageFormInPayload {
  type: EManageFormType
  status?: EManageFormStatus
  data?: any
}

export interface IManageFormInResponse {
  type: EManageFormType
  status: EManageFormStatus
  data?: any
}

export enum EManageFormType {
  SUBJECT_REGISTRATION = 'subject_registration',
  SUBJECT_EVALUATION = 'subject_evaluation',
  SUBJECT_ABSENT = 'subject_absent',
}

export enum EManageFormStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
}
