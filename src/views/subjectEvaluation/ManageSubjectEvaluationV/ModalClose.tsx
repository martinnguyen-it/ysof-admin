import { WarningFilled } from '@ant-design/icons'
import { EManageFormStatus, EManageFormType, IManageFormInPayload } from '@domain/manageForm'
import { updateManageForm } from '@src/services/manageForm'
import { Button, Modal } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useState } from 'react'
import { toast } from 'react-toastify'

interface IProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setReloadData: React.DispatchWithoutAction
}

const ModalClose: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)

  const onClose = async () => {
    setConfirmLoading(true)
    const payload: IManageFormInPayload = {
      type: EManageFormType.SUBJECT_EVALUATION,
      status: EManageFormStatus.CLOSED,
    }
    const res = await updateManageForm(payload)
    if (!isEmpty(res)) {
      toast.success('Đóng form thành công')
      setReloadData()
      setOpen(false)
    }
    setConfirmLoading(false)
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
        <Button key='submit' type='primary' className='!bg-red-500' loading={confirmLoading} onClick={onClose}>
          Tạm đóng
        </Button>,
      ]}
    >
      Bạn muốn tạm đóng form lượng giá ?
    </Modal>
  )
}

export default ModalClose
