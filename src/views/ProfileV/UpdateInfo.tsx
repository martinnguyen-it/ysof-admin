import { useEffect, useState } from 'react'
import { useUpdateMe } from '@/apis/admin/useMutationAdmin'
import { userInfoState } from '@/atom/authAtom'
import { OPTIONS_ROLE } from '@/constants'
import { EAdminRole, IAdminInResponse } from '@/domain/admin/type'
import { Button, DatePicker, DatePickerProps, Form, Input, Select } from 'antd'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'

const UpdateInfo = () => {
  const [form] = Form.useForm()

  const [dateOfBirth, setDateOfBirth] = useState<string>()
  const [userInfo, setUserInfo] = useRecoilState(userInfoState)

  const onSuccessUpdateMe = (data: IAdminInResponse) => {
    toast.success('Cập nhật thành công.')
    setUserInfo(data)
  }

  const { mutate: mutateUpdateMe, isPending: isLoadingUpdate } =
    useUpdateMe(onSuccessUpdateMe)

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_of_birth_temp
      delete data.roles
      delete data.email
      mutateUpdateMe({ ...data, date_of_birth: dateOfBirth || undefined })
    } catch {
      /* empty */
    }
  }

  const onChangeDateOfBirth: DatePickerProps['onChange'] = (_, dateString) => {
    setDateOfBirth(
      dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD')
    )
  }

  useEffect(() => {
    form.setFieldsValue({
      ...userInfo,
      date_of_birth: undefined,
      date_of_birth_temp: userInfo?.date_of_birth
        ? dayjs(userInfo.date_of_birth, 'YYYY-MM-DD')
        : undefined,
    })
  }, [userInfo])

  return (
    <Form layout='vertical' form={form} name='form-update-info'>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-3'>
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
              message: 'Vui lòng nhập email',
            },
            {
              type: 'email',
              message: 'Email không đúng định dạng',
            },
          ]}
        >
          <Input disabled />
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
            disabled
            mode='multiple'
            placeholder='Chọn ban'
            options={OPTIONS_ROLE.filter(
              (item) => item.value != EAdminRole.ADMIN
            )}
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
        <Form.Item name='facebook' label='Facebook'>
          <Input />
        </Form.Item>
        <Form.Item name='patronal_day' label='Ngày bổn mạng'>
          <Input />
        </Form.Item>
        <Form.Item name='date_of_birth_temp' label='Ngày sinh'>
          <DatePicker
            placeholder='DD/MM/YYYY'
            format={'DD/MM/YYYY'}
            onChange={onChangeDateOfBirth}
          />
        </Form.Item>
      </div>
      <div className='flex justify-end'>
        <Button type='primary' onClick={handleSubmit} loading={isLoadingUpdate}>
          Cập nhật
        </Button>
      </div>
    </Form>
  )
}

export default UpdateInfo
