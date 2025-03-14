import { HTMLAttributes } from 'react'
import { Link } from '@tanstack/react-router'
import { MailOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { toast } from 'react-toastify'
import { cn } from '@/lib/utils'

type ForgotFormProps = HTMLAttributes<HTMLDivElement>

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const onSubmit = ({ email }: { email: string }) => {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ onReset ~ email:', email)
    toast.warning('This feature is not currently available.')
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form name='form-login' layout='vertical' onFinish={onSubmit}>
        <Form.Item
          name='email'
          label='Email'
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
          <Input prefix={<MailOutlined />} placeholder='ysofweb21@gmail.com' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Link to='/sign-in'>Quay lại đăng nhập</Link>
        </Form.Item>
        <Button htmlType='submit' className='w-full' type='primary'>
          Quên mật khẩu
        </Button>
      </Form>
    </div>
  )
}
