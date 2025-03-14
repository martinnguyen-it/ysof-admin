import React, { FC } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteSubject } from '@/apis/subject/useMutationSubject'
import { IOpenForm } from '@/domain/common'
import { WarningFilled } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { toast } from 'react-toastify'

interface IProps {
  open: IOpenForm<string>
  setOpen: React.Dispatch<React.SetStateAction<IOpenForm<string>>>
}

const ModalDelete: FC<IProps> = ({ open, setOpen }) => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListSubjects'] })
    toast.success('Xóa thành công')
    setOpen({ active: false })
  }

  const { mutate, isPending } = useDeleteSubject(onSuccess)

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
        <Button
          key='submit'
          type='primary'
          className='!bg-red-500'
          loading={isPending}
          onClick={handleOk}
        >
          Xóa
        </Button>,
      ]}
    >
      Bạn muốn xóa môn học này ?
    </Modal>
  )
}

export default ModalDelete
