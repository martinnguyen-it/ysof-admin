import { EManageFormStatus } from '@/domain/manageForm'

export const EManageFormStatusDetail: { [key in EManageFormStatus]: string } = {
  [EManageFormStatus.ACTIVE]: 'Đang mở',
  [EManageFormStatus.INACTIVE]: 'Chưa khởi tạo',
  [EManageFormStatus.CLOSED]: 'Đã đóng',
}
