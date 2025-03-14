import React, { FC } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteSubjectAbsents } from '@/apis/subjectAbsent/useMutationSubjectAbsent'
import { IOpenForm } from '@/domain/common'
import { WarningFilled } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { toast } from 'react-toastify'

interface IProps {
  open: IOpenForm<{ studentId: string; subjectId: string }>
  setOpen: React.Dispatch<
    React.SetStateAction<IOpenForm<{ studentId: string; subjectId: string }>>
  >
}

const ModalDelete: FC<IProps> = ({ open, setOpen }) => {
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListSubjectAbsents'] })
    toast.success('Xóa thành công')
    setOpen({ active: false })
  }

  const { mutate, isPending } = useDeleteSubjectAbsents(onSuccess)

  const handleOk = () => {
    mutate({
      subjectId: open?.item?.subjectId || '',
      studentId: open?.item?.studentId || '',
    })
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
      Bạn muốn xóa đơn nghỉ phép này ?
    </Modal>
  )
}

export default ModalDelete
