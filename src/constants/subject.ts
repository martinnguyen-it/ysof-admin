import { ESubjectStatus } from '@domain/subject'

export const ESubjectStatusDetail: { [key in ESubjectStatus]: string } = {
  [ESubjectStatus.INIT]: 'Khởi tạo',
  [ESubjectStatus.SENT_STUDENT]: 'Đã gửi email thông báo học',
  [ESubjectStatus.SENT_EVALUATION]: 'Đã gửi form lượng giá',
  [ESubjectStatus.COMPLETED]: 'Đã hoàn thành',
}

export const SUBDIVISION = ['Đức Tin Kitô Giáo', 'Kinh Thánh', 'Đời sống Kitô Giáo', 'Thiêng liêng', 'Người trẻ và xã hội', 'Người trẻ thời đại mới']

export const OPTIONS_SUBDIVISION = SUBDIVISION.map((value) => ({
  value,
  label: value,
}))

export const OPTIONS_SUBJECT_STATUS = Object.keys(ESubjectStatusDetail).map((key) => ({
  value: key,
  label: ESubjectStatusDetail[key as ESubjectStatus],
}))
