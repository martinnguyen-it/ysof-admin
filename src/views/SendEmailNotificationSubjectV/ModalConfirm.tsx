import { WarningFilled } from '@ant-design/icons'
import { ISubjectInResponse } from '@domain/subject'
import { useSubjectSendNotification, useUpdateSubject } from '@src/apis/subject/useMutationSubject'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Modal } from 'antd'
import React, { FC } from 'react'
import { toast } from 'react-toastify'

interface IProps {
  open: { active: boolean; item: any }
  setOpen: React.Dispatch<React.SetStateAction<{ active: boolean; item: any }>>
  subject: ISubjectInResponse
}

const ModalConfirm: FC<IProps> = ({ open, setOpen, subject }) => {
  const queryClient = useQueryClient()

  const onSuccessUpdateSubject = () => {
    mutateSendNotification(subject.id)
  }

  const onSuccessSendNotification = () => {
    queryClient.invalidateQueries({ queryKey: ['getSubjectNextMostRecent'] })
    queryClient.invalidateQueries({ queryKey: ['getSubjectLastSentStudentRecent'] })
    toast.success('Gửi thành công')
    setOpen({ active: false, item: undefined })
  }

  const { mutate: mutateUpdateSubject, isPending: isPendingUpdate } = useUpdateSubject(onSuccessUpdateSubject)
  const { mutate: mutateSendNotification, isPending: isPendingSend } = useSubjectSendNotification(onSuccessSendNotification)

  const onSubmit = () => {
    mutateUpdateSubject({
      subjectId: subject.id,
      data: open.item,
    })
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
      confirmLoading={isPendingUpdate || isPendingSend}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key='submit' type='primary' loading={isPendingUpdate || isPendingSend} onClick={onSubmit}>
          Gửi
        </Button>,
      ]}
    >
      <p className='italic'>Lưu ý: Thao tác này sẽ không thể hoàn tác</p>
    </Modal>
  )
}

export default ModalConfirm
