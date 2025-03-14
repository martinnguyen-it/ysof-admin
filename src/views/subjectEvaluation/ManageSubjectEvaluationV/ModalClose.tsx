import { FC } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateManageForm } from '@/apis/manageForm/useMutationManageForm'
import {
  EManageFormStatus,
  EManageFormType,
  IManageFormInPayload,
} from '@/domain/manageForm'
import { WarningFilled } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { toast } from 'react-toastify'

interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalClose: FC<IProps> = ({ open, setOpen }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: confirmLoading } = useUpdateManageForm(() => {
    toast.success('Đóng form thành công')
    queryClient.invalidateQueries({ queryKey: ['getManageForm'] })
    setOpen(false)
  })
  const onClose = () => {
    const payload: IManageFormInPayload = {
      type: EManageFormType.SUBJECT_EVALUATION,
      status: EManageFormStatus.CLOSED,
    }
    mutate(payload)
  }
  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Modal
      title={<WarningFilled className='text-yellow-400' />}
      open={open}
      onOk={onClose}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key='submit'
          type='primary'
          className='!bg-red-500'
          loading={confirmLoading}
          onClick={onClose}
        >
          Tạm đóng
        </Button>,
      ]}
    >
      Bạn muốn tạm đóng form lượng giá ?
    </Modal>
  )
}

export default ModalClose
