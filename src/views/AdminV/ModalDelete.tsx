import { WarningFilled } from '@ant-design/icons'
import { IOpenForm } from '@domain/common'
import { deleteAdmin } from '@src/services/admin'
import { Button, Modal } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useState } from 'react'
import { toast } from 'react-toastify'

interface IProps {
  open: IOpenForm<string>
  setOpen: React.Dispatch<React.SetStateAction<IOpenForm<string>>>
  setReloadData: React.DispatchWithoutAction
}

const ModalDelete: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = async () => {
    setConfirmLoading(true)
    const res = await deleteAdmin(open?.item || '')
    if (!isEmpty(res)) {
      toast.success('Xóa thành công')
      setOpen({ active: false })
      setReloadData()
    }
    setConfirmLoading(false)
  }

  const handleCancel = () => {
    setOpen({ active: false })
  }
  return (
    <Modal
      title={<WarningFilled className='text-yellow-400' />}
      open={open.active}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' className='!bg-red-500' loading={confirmLoading} onClick={handleOk}>
          Xóa
        </Button>,
      ]}
    >
      Bạn muốn xóa giảng viên này ?
    </Modal>
  )
}

export default ModalDelete
