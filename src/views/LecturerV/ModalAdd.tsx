import React, { Dispatch, FC, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateLecturer,
  useUpdateLecturer,
} from '@/apis/lecturer/useMutationLecturer'
import { IOpenFormWithMode } from '@/domain/common'
import { ILecturerInResponse } from '@/domain/lecturer'
import { Form, Input, Modal } from 'antd'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'

interface IProps {
  open: IOpenFormWithMode<ILecturerInResponse>
  setOpen: Dispatch<
    React.SetStateAction<IOpenFormWithMode<ILecturerInResponse>>
  >
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const isUpdateForm = !isEmpty(open?.item)

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListLecturers'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else toast.success('Thêm thành công')
    setOpen({ active: false, mode: 'add' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateLecturer(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateLecturer(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_start_at
      delete data.date_end_at
      if (open?.item) {
        mutateUpdate({
          id: open.item.id,
          data,
        })
      } else {
        mutateCreate(data)
      }
    } catch {}
  }
  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  useEffect(() => {
    if (open?.item)
      form.setFieldsValue({
        ...open.item,
        start_at: undefined,
        end_at: undefined,
      })
    else form.resetFields()
  }, [open])

  return (
    <Modal
      title={open.item ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingUpdate || isPendingCreate}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
    >
      <Form layout='vertical' form={form} name='form-add-lecturer'>
        <Form.Item
          name='title'
          label='Chức danh'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp chức danh',
            },
          ]}
        >
          <Input placeholder='Cha, thầy, nhóm,...' />
        </Form.Item>
        <Form.Item label='Tên thánh' name='holy_name'>
          <Input placeholder='Martin' />
        </Form.Item>
        <Form.Item
          name='full_name'
          label='Họ và tên'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên',
            },
          ]}
        >
          <Input placeholder='Nhập họ và tên' />
        </Form.Item>
        <Form.Item
          label='Thông tin cơ bản (Lưu ý: Học viên sẽ thấy phần này)'
          name='information'
        >
          <Input.TextArea
            rows={3}
            placeholder='Tốt nghiệp, nơi đang phục vụ,...'
          />
        </Form.Item>
        <Form.Item label='Thông tin liên hệ' name='contact'>
          <Input.TextArea rows={3} placeholder='Email, số điện thoại,...' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
