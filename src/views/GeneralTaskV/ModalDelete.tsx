import { WarningFilled } from '@ant-design/icons'
import { IOpenForm } from '@domain/common'
import { useDeleteGeneralTask } from '@src/apis/generalTask/useMutationGeneralTask'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Modal } from 'antd'
import React, { FC } from 'react'
import { toast } from 'react-toastify'

interface IProps {
  open: IOpenForm<string>
  setOpen: React.Dispatch<React.SetStateAction<IOpenForm<string>>>
}

const ModalDelete: FC<IProps> = ({ open, setOpen }) => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListGeneralTasks'] })
    toast.success('Xóa thành công')
    setOpen({ active: false })
  }

  const { mutate, isPending } = useDeleteGeneralTask(onSuccess)

  const handleOk = () => {
    mutate(open?.item || '')
  }
  const handleCancel = () => {
    setOpen({ active: false })
  }
  return (
    <Modal
      title={<WarningFilled className='text-yellow-400' />}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPending}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' className='!bg-red-500' loading={isPending} onClick={handleOk}>
          Xóa
        </Button>,
      ]}
    >
      Bạn muốn xóa công việc này ?
    </Modal>
  )
}

export default ModalDelete
