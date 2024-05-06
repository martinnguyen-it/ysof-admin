import { Form, Input, Modal } from 'antd'
import { isEmpty } from 'lodash'
import React, { Dispatch, DispatchWithoutAction, FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IOpenFormWithMode } from '@domain/common'
import { ILecturerInResponse } from '@domain/lecturer'
import { createLecturer, updateLecturer } from '@src/services/lecturer'

interface IProps {
  open: IOpenFormWithMode<ILecturerInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<ILecturerInResponse>>>
  setReloadData: DispatchWithoutAction
}

const ModalAdd: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = async () => {
    setConfirmLoading(true)
    let res: ILecturerInResponse
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_start_at
      delete data.date_end_at
      if (open?.item) {
        res = await updateLecturer(open.item.id, data)
        if (!isEmpty(res)) {
          toast.success('Sửa thành công')
          setOpen({ active: false, mode: 'add' })
          setReloadData()
        }
      } else {
        res = await createLecturer(data)
        if (!isEmpty(res)) {
          toast.success('Thêm thành công')
          setOpen({ active: false, mode: 'add' })
          setReloadData()
        }
      }
    } catch (error) {
      setConfirmLoading(false)
    }

    setConfirmLoading(false)
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
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
    >
      <Form layout='vertical' form={form} name='form-season'>
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
        <Form.Item label='Thông tin cơ bản (Lưu ý: Học viên sẽ thấy phần này)' name='information'>
          <Input.TextArea rows={3} placeholder='Tốt nghiệp, nơi đang phục vụ,...' />
        </Form.Item>
        <Form.Item label='Thông tin liên hệ' name='contact'>
          <Input.TextArea rows={3} placeholder='Email, số điện thoại,...' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
