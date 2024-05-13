import { WarningFilled } from '@ant-design/icons'
import { ISubjectInResponse } from '@domain/subject'
import { subjectSendNotification, updateSubject } from '@src/services/subject'
import { Button, Modal } from 'antd'
import { isEmpty, isObject } from 'lodash'
import React, { FC, useState } from 'react'
import { toast } from 'react-toastify'

interface IProps {
  open: { active: boolean; item: any }
  setOpen: React.Dispatch<React.SetStateAction<{ active: boolean; item: any }>>
  subject: ISubjectInResponse
  setReloadData: React.DispatchWithoutAction
}

const ModalConfirm: FC<IProps> = ({ open, setOpen, setReloadData, subject }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)

  const onSubmit = async () => {
    setConfirmLoading(true)
    const resUpdate = await updateSubject(subject.id, open.item)
    if (!isEmpty(resUpdate)) {
      const resSendNotification = await subjectSendNotification(subject.id)
      if (!isObject(resSendNotification) && resSendNotification) {
        toast.success('Gửi thành công')
        setReloadData()
        setOpen({ active: false, item: undefined })
      }
    }

    setConfirmLoading(false)
  }
  const handleCancel = () => {
    setOpen({ active: false, item: undefined })
  }
  return (
    <Modal
      title={
        <span className='text-lg'>
          <WarningFilled className='text-yellow-400' /> Xác nhận thông tin và gửi
        </span>
      }
      open={open.active}
      onOk={handleCancel}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' loading={confirmLoading} onClick={onSubmit}>
          Gửi
        </Button>,
      ]}
    >
      <p className='italic'>Lưu ý: Thao tác này sẽ không thể hoàn tác</p>
    </Modal>
  )
}

export default ModalConfirm
