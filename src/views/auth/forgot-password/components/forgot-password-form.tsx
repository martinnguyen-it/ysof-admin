import { Dispatch, SetStateAction } from 'react'
import { Link } from '@tanstack/react-router'
import { useForgotPassword } from '@/apis/auth/useResetPassword'
import { MailOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { toast } from 'react-toastify'

interface IProps {
  setEmail: Dispatch<SetStateAction<string>>
}
export function ForgotForm({ setEmail }: IProps) {
  const { mutate: forgotPassword, isPending } = useForgotPassword()
  const onSubmit = ({ email }: { email: string }) => {
    forgotPassword(email, {
      onSuccess: ({ message }) => {
        toast.success(message || 'Gửi mã OTP thành công')
        setEmail(email)
      },
    })
  }

  return (
    <div className='grid gap-6'>
      <div className='mb-2 flex flex-col space-y-2 text-left'>
        <h1 className='text-center text-2xl font-semibold tracking-tight'>
          Quên mật khẩu
        </h1>
        <p className='text-sm text-muted-foreground'>
          Nhập email của bạn, hệ thống sẽ gửi bạn mã OTP gồm 6 chữ số qua email
          để đặt lại mật khẩu
        </p>
      </div>

      <Form name='form-login' layout='vertical' onFinish={onSubmit}>
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
          <Input prefix={<MailOutlined />} placeholder='ysofweb21@gmail.com' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Link to='/dang-nhap'>Quay lại đăng nhập</Link>
        </Form.Item>
        <Button
          disabled={isPending}
          loading={isPending}
          htmlType='submit'
          className='w-full'
          type='primary'
        >
          Gửi
        </Button>
      </Form>

      <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
        Không có tài khoản? Vui lòng liên hệ{' '}
        <a
          className='underline'
          href={`mailto:${import.meta.env.VITE_MAIL_TO_YSOF}`}
        >
          {import.meta.env.VITE_MAIL_TO_YSOF}
        </a>
        .
      </p>
    </div>
  )
}
