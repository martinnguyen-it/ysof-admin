import React, { Dispatch, FC, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateAdmin, useUpdateAdmin } from '@/apis/admin/useMutationAdmin'
import { EAdminRole, IAdminInResponse } from '@/domain/admin/type'
import { IOpenFormWithMode } from '@/domain/common'
import { DatePicker, DatePickerProps, Form, Input, Modal, Select } from 'antd'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { OPTIONS_ROLE } from '@/constants/index'

interface IProps {
  open: IOpenFormWithMode<IAdminInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<IAdminInResponse>>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const [dateOfBirth, setDateOfBirth] = useState<string>()

  const isUpdateForm = open.mode === 'update'
  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListAdmins'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else toast.success('Thêm thành công')
    setOpen({ active: false, mode: 'add' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateAdmin(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateAdmin(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_of_birth_temp
      if (open.mode === 'update') {
        if (open?.item) {
          mutateUpdate({
            id: open.item.id,
            data: { ...data, date_of_birth: dateOfBirth || undefined },
          })
        }
      } else {
        mutateCreate({ ...data, date_of_birth: dateOfBirth || undefined })
      }
    } catch {
      /* empty */
    }
  }
  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  useEffect(() => {
    if (open?.item)
      form.setFieldsValue({
        ...open.item,
        date_of_birth: undefined,
        date_of_birth_temp: open.item.date_of_birth
          ? dayjs(open.item.date_of_birth, 'YYYY-MM-DD')
          : undefined,
      })
    else form.resetFields()
  }, [open])

  const optionsRole = OPTIONS_ROLE.filter(
    (item) => item.value != EAdminRole.ADMIN
  )

  const onChangeDateOfBirth: DatePickerProps['onChange'] = (_, dateString) => {
    setDateOfBirth(
      dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD')
    )
  }

  return (
    <Modal
      title={open.item ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingCreate || isPendingUpdate}
      onCancel={handleCancel}
      className='sm:!w-[70vw] lg:!w-[60vw]'
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
    >
      <Form
        layout='vertical'
        form={form}
        name='form-add-admin'
        className='grid grid-cols-1 gap-x-3 sm:grid-cols-2'
      >
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
          <Select
            allowClear
            mode='multiple'
            placeholder='Chọn ban'
            options={optionsRole}
          />
        </Form.Item>
        <Form.Item name='phone_number' label='Số điện thoại'>
          <Select
            allowClear
            mode='tags'
            placeholder='Có thể nhập nhiều số'
            showSearch
          />
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
