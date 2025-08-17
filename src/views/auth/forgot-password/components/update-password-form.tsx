import { useNavigate } from '@tanstack/react-router'
import { useResetPassword } from '@/apis/auth/useResetPassword'
import { IResetPasswordRequest } from '@/domain/auth/type'
import { Button, Form, Input } from 'antd'
import { toast } from 'react-toastify'

interface IProps {
  token: string
}
export function UpdatePasswordForm({ token }: IProps) {
  const { mutate: resetPassword, isPending } = useResetPassword()
  const navigate = useNavigate()
  const onSubmit = (data: IResetPasswordRequest) => {
    resetPassword(
      {
        new_password: data.new_password,
        token,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message || 'Đổi mật khẩu thành công')
          navigate({ to: '/dang-nhap' })
        },
      }
    )
  }

  return (
    <div className='grid gap-6'>
      <div className='mb-2 flex flex-col space-y-2 text-left'>
        <h1 className='text-center text-2xl font-semibold tracking-tight'>
          Nhập mật khẩu mới
        </h1>
        <p className='text-sm text-muted-foreground'>
          Nhập mật khẩu mới để đặt lại mật khẩu
        </p>
      </div>
      <Form name='form-login' layout='vertical' onFinish={onSubmit}>
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
        <Button
          disabled={isPending}
          loading={isPending}
          type='primary'
          htmlType='submit'
          className='w-full'
        >
          Xác nhận
        </Button>
      </Form>
    </div>
  )
}
