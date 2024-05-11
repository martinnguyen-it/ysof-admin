import { DatePicker, DatePickerProps, Form, Input, Modal, Select } from 'antd'
import { isEmpty } from 'lodash'
import React, { Dispatch, DispatchWithoutAction, FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IOpenFormWithMode } from '@domain/common'
import { EAdminRole, IAdminInResponse } from '@domain/admin/type'
import { createAdmin, updateAdmin } from '@src/services/admin'
import { OPTIONS_ROLE } from '@constants/index'
import dayjs from 'dayjs'

interface IProps {
  open: IOpenFormWithMode<IAdminInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<IAdminInResponse>>>
  setReloadData: DispatchWithoutAction
}

const ModalAdd: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState<string>()

  const handleOk = async () => {
    setConfirmLoading(true)
    let res: IAdminInResponse
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_of_birth_temp
      if (open.mode === 'update') {
        if (open?.item) {
          res = await updateAdmin(open.item.id, { ...data, date_of_birth: dateOfBirth || undefined })
          if (!isEmpty(res)) {
            toast.success('Sửa thành công')
            setOpen({ active: false, mode: 'add' })
            setReloadData()
          }
        }
      } else {
        res = await createAdmin({ ...data, date_of_birth: dateOfBirth || undefined })
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
        date_of_birth: undefined,
        date_of_birth_temp: open.item.date_of_birth ? dayjs(open.item.date_of_birth, 'YYYY-MM-DD') : undefined,
      })
    else form.resetFields()
  }, [open])

  const optionsRole = OPTIONS_ROLE.filter((item) => item.value != EAdminRole.ADMIN)

  const onChangeDateOfBirth: DatePickerProps['onChange'] = (_, dateString) => {
    setDateOfBirth(dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD'))
  }

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
      <Form layout='vertical' form={form} name='form-add-admin'>
        <Form.Item
          label='Tên thánh'
          name='holy_name'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp tên thánh',
            },
          ]}
        >
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
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp email',
            },
            {
              type: 'email',
              message: 'Email không đúng định dạng',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='roles'
          label='Thuộc ban'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ban',
            },
          ]}
        >
          <Select allowClear mode='multiple' placeholder='Chọn ban' options={optionsRole} />
        </Form.Item>
        <Form.Item name='phone_number' label='Số điện thoại'>
          <Select allowClear mode='tags' placeholder='Có thể nhập nhiều số' showSearch />
        </Form.Item>
        <Form.Item name={['address', 'original']} label='Quê quán'>
          <Input />
        </Form.Item>
        <Form.Item name={['address', 'current']} label='Nơi ở hiện tại'>
          <Input />
        </Form.Item>
        <Form.Item name={['address', 'diocese']} label='Giáo phận'>
          <Input />
        </Form.Item>
        <Form.Item name='date_of_birth_temp' label='Ngày sinh'>
          <DatePicker format={'DD/MM/YYYY'} onChange={onChangeDateOfBirth} />
        </Form.Item>
        <Form.Item name='facebook' label='Facebook'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
