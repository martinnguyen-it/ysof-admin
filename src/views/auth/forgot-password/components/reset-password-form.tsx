import { Dispatch, SetStateAction } from 'react'
import { useVerifyOTP } from '@/apis/auth/useResetPassword'
import { IVerifyOTP } from '@/domain/auth/type'
import { MailOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'

interface IProps {
  email: string
  setToken: Dispatch<SetStateAction<string>>
}
export function VerifyCodeResetForm({ email, setToken }: IProps) {
  const { mutate: verifyOTP, isPending } = useVerifyOTP()

  const onSubmit = (data: IVerifyOTP) => {
    verifyOTP(data, {
      onSuccess: (res) => {
        setToken(res.reset_token)
      },
    })
  }

  return (
    <div className='grid gap-6'>
      <div className='mb-2 flex flex-col space-y-2 text-left'>
        <h1 className='text-center text-2xl font-semibold tracking-tight'>
          Nhập mã OTP
        </h1>
        <p className='text-sm text-muted-foreground'>
          Nhập mã OTP gồm 6 chữ số đã được gửi qua email để đặt lại mật khẩu
        </p>
      </div>

      <Form name='form-login' layout='vertical' onFinish={onSubmit}>
        <Form.Item<IVerifyOTP>
          name='email'
          label='Email'
          initialValue={email}
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
          <Input
            disabled
            prefix={<MailOutlined />}
            placeholder='ysofweb21@gmail.com'
          />
        </Form.Item>
        <Form.Item<IVerifyOTP>
          name='otp'
          label='Mã OTP'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp mã OTP',
            },
            {
              min: 6,
              message: 'Mã OTP phải có 6 chữ số',
            },
            {
              max: 6,
            },
            {
              pattern: /^[0-9]+$/,
              message: 'Mã OTP chỉ được chứa chữ số',
            },
          ]}
        >
          <Input.OTP separator={(idx) => idx === 2 && <span>-</span>} />
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
