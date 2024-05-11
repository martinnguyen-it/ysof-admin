import { userInfoState } from '@atom/authAtom'
import { updateAdminMe } from '@src/services/admin'
import { updatePassword } from '@src/services/auth'
import { Button, DatePicker, DatePickerProps, Divider, Form, Input, Select } from 'antd'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'

const ProfileV: FC = () => {
  const [form] = Form.useForm()
  const [formChangePassword] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState<string>()
  const [userInfo, setUserInfo] = useRecoilState(userInfoState)

  const handleSubmit = async () => {
    setConfirmLoading(true)
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_of_birth_temp
      delete data.roles
      delete data.email
      const res = await updateAdminMe({ ...data, date_of_birth: dateOfBirth || undefined })
      if (!isEmpty(res)) {
        toast.success('Cập nhật thành công.')
        setUserInfo(res)
      }
    } catch (error) {
      setConfirmLoading(false)
    }

    setConfirmLoading(false)
  }
  const handleChangePassword = async () => {
    setChangePasswordLoading(true)
    try {
      await formChangePassword.validateFields()
      const data = formChangePassword.getFieldsValue()
      delete data.confirm_password
      const res = await updatePassword(data)
      if (!isEmpty(res)) {
        formChangePassword.resetFields()
        toast.success('Cập nhật thành công.')
      }
    } catch (error) {
      setChangePasswordLoading(false)
    }

    setChangePasswordLoading(false)
  }

  useEffect(() => {
    form.setFieldsValue({
      ...userInfo,
      date_of_birth: undefined,
      date_of_birth_temp: userInfo?.date_of_birth ? dayjs(userInfo.date_of_birth, 'YYYY-MM-DD') : undefined,
    })
  }, [userInfo])

  const onChangeDateOfBirth: DatePickerProps['onChange'] = (_, dateString) => {
    setDateOfBirth(dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD'))
  }

  return (
    <div className='m-6 mx-auto w-[70vw]'>
      <div className='rounded-xl bg-white px-10 py-6 shadow-lg'>
        <div className='mb-4 flex justify-center text-2xl font-bold'>CẬP NHẬT THÔNG TIN</div>
        <Form layout='vertical' form={form} name='form-update-info'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
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
              <Select disabled mode='multiple' placeholder='Chọn ban' />
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
            <Form.Item name='facebook' label='Facebook'>
              <Input />
            </Form.Item>
            <Form.Item name='date_of_birth_temp' label='Ngày sinh'>
              <DatePicker format={'DD/MM/YYYY'} onChange={onChangeDateOfBirth} />
            </Form.Item>
          </div>
        </Form>
        <div className='flex justify-end'>
          <Button type='primary' onClick={handleSubmit} loading={confirmLoading}>
            Cập nhật
          </Button>
        </div>
        <Divider />
        <div className='mb-4 flex justify-center text-2xl font-bold'>THAY ĐỔI MẬT KHẨU</div>
        <Form layout='vertical' className='mx-auto w-[400px]' form={formChangePassword} name='form-change-password'>
          <Form.Item
            label='Mật khẩu hiện tại'
            name='old_password'
            rules={[
              {
                required: true,
                message: 'Không được để trống trường này',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='new_password'
            dependencies={['old_password']}
            label='Mật khẩu mới'
            rules={[
              {
                required: true,
                message: 'Không được để trống trường này',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label='Xác nhận mật khẩu'
            dependencies={['new_password']}
            name='confirm_password'
            rules={[
              {
                required: true,
                message: 'Không được để trống trường này',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu đã nhập không khớp'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className='flex justify-end'>
            <Button type='primary' loading={changePasswordLoading} onClick={handleChangePassword}>
              Xác nhận
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ProfileV
