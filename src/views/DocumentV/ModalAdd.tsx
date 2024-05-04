import { IOpenForm } from '@domain/common'
import { IDocumentInResponse } from '@domain/document'
import { createDocumentWithFile, updateDocument } from '@src/services/document'
import { Form, Input, Modal } from 'antd'
import { isEmpty } from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface IProps {
  open: IOpenForm<IDocumentInResponse>
  setOpen: React.Dispatch<React.SetStateAction<IOpenForm<IDocumentInResponse>>>
  setReloadData: React.DispatchWithoutAction
}

const ModalAdd: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      let res: IDocumentInResponse
      if (open?.item) {
        res = await updateDocument(open.item.id, data)
        if (!isEmpty(res)) {
          toast.success('Sửa thành công')
          setOpen({ active: false })
          setReloadData()
        }
      } else {
        res = await createDocumentWithFile(data)
        if (!isEmpty(res)) {
          toast.success('Thêm thành công')
          setOpen({ active: false })
          setReloadData()
        }
      }
    } catch (error) {
      setConfirmLoading(false)
    }

    setConfirmLoading(false)
  }

  const handleCancel = () => {
    setOpen({ active: false })
  }

  useEffect(() => {
    if (open?.item) form.setFieldsValue(open.item)
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
          label='Tên'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp tên chủ đề',
            },
          ]}
        >
          <Input placeholder='Tên chủ đề năm học' />
        </Form.Item>
        <Form.Item
          name='season'
          label='Mùa'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp mùa',
            },
          ]}
        >
          <Input placeholder='1' disabled={!!open?.item} />
        </Form.Item>
        <Form.Item
          name='academic_year'
          label='Năm học'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp năm học',
            },
          ]}
        >
          <Input placeholder='2020-2021' />
        </Form.Item>
        <Form.Item label='Mô tả' name='description'>
          <Input placeholder='Nhập mô tả' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
