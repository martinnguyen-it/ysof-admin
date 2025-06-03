import React, { Dispatch, FC, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRollCall } from '@/apis/roll-call/useMutationRollcall'
import { Form, Modal } from 'antd'
import { toast } from 'react-toastify'
import FormRollCall from './FormRollCall'

interface IProps {
  open: boolean
  setOpen: Dispatch<React.SetStateAction<boolean>>
}

const ModalRollCall: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListRollCallResult'] })
    toast.success('Xử lý thành công')
    setOpen(false)
  }

  const { mutate, isPending } = useRollCall(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      mutate(data)
    } catch {}
  }
  const handleCancel = () => {
    setOpen(false)
  }

  useEffect(() => {
    form.setFieldsValue({
      sheet_name: 'main',
      url: 'https://docs.google.com/spreadsheets/d/',
    })
  }, [])

  return (
    <Modal
      title={'Điểm danh'}
      open={open}
      onOk={handleOk}
      confirmLoading={isPending}
      onCancel={handleCancel}
      cancelText={'Hủy'}
      okText={'Điểm danh'}
      maskClosable={false}
    >
      <FormRollCall form={form} />
    </Modal>
  )
}

export default ModalRollCall
