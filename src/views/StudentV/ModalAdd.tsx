import React, { Dispatch, FC, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateStudent,
  useUpdateStudent,
} from '@/apis/student/useMutationStudent'
import { IOpenFormWithMode } from '@/domain/common'
import { IStudentInResponse } from '@/domain/student'
import { DatePicker, DatePickerProps, Form, Input, Modal, Select } from 'antd'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { OPTION_SEX } from '@/constants/student'

interface IProps {
  open: IOpenFormWithMode<IStudentInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<IStudentInResponse>>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const [dateOfBirth, setDateOfBirth] = useState<string>()

  const queryClient = useQueryClient()

  const isUpdateForm = !isEmpty(open?.item)

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListStudents'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else toast.success('Thêm thành công')
    setOpen({ active: false, mode: 'add' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateStudent(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateStudent(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_of_birth_temp
      if (open?.item) {
        mutateUpdate({
          id: open.item.id,
          data: { ...data, date_of_birth: dateOfBirth || undefined },
        })
      } else {
        mutateCreate({ ...data, date_of_birth: dateOfBirth || undefined })
      }
    } catch {}
  }

  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  useEffect(() => {
    if (open?.item) {
      const lenSeasons = open.item.seasons_info.length
      form.setFieldsValue({
        ...open.item,
        date_of_birth: undefined,
        date_of_birth_temp: open.item.date_of_birth
          ? dayjs(open.item.date_of_birth, 'YYYY-MM-DD')
          : undefined,
        numerical_order: open.item.seasons_info[lenSeasons - 1].numerical_order,
        group: open.item.seasons_info[lenSeasons - 1].group,
      })
    } else form.resetFields()
  }, [open])

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
      confirmLoading={isPendingUpdate || isPendingCreate}
      onCancel={handleCancel}
      className='sm:!w-[70vw] lg:!w-[60vw]'
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
    >
      <Form
        layout='vertical'
        form={form}
        name='form-add-student'
        className='grid grid-cols-1 gap-x-3 sm:grid-cols-2'
      >
        <Form.Item
          name='numerical_order'
          label='MSHV'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp MSHV',
            },
          ]}
        >
          <Input type='number' placeholder='1' />
        </Form.Item>
        <Form.Item
          name='group'
          label='Nhóm'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp nhóm',
            },
          ]}
        >
          <Input type='number' placeholder='1' />
        </Form.Item>
        <Form.Item
          label='Tên thánh'
          name='holy_name'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên thánh',
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
              message: 'Vui lòng nhập họ tên',
            },
          ]}
        >
          <Input placeholder='Nhập họ và tên' />
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email',
            },
            {
              type: 'email',
              message: 'Email không đúng định dạng',
            },
          ]}
        >
          <Input placeholder='Nhập email' />
        </Form.Item>
        <Form.Item name='sex' label='Giới tính'>
          <Select placeholder='Chọn giới tính' options={OPTION_SEX} />
        </Form.Item>
        <Form.Item name='date_of_birth_temp' label='Ngày sinh'>
          <DatePicker
            placeholder='DD/MM/YYYY'
            format={'DD/MM/YYYY'}
            onChange={onChangeDateOfBirth}
          />
        </Form.Item>
        <Form.Item name='origin_address' label='Quê quán'>
          <Input placeholder='Nhập quê quán' />
        </Form.Item>
        <Form.Item name='diocese' label='Giáo phận đang sinh hoạt'>
          <Input placeholder='Nhập giáo phận đang sinh hoạt' />
        </Form.Item>
        <Form.Item name='phone_number' label='Số điện thoại'>
          <Input placeholder='Nhập số điện thoại' />
        </Form.Item>
        <Form.Item name='education' label='Trình độ học vấn'>
          <Input placeholder='Nhập trình độ học vấn' />
        </Form.Item>
        <Form.Item name='job' label='Công việc'>
          <Input placeholder='Nhập công việc' />
        </Form.Item>
        <Form.Item label='Ghi chú (Học viên không thấy phần này)' name='note'>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
