import { HTMLAttributes, useEffect } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useLogin } from '@/apis/auth/useLogin'
import { accessTokenState, userInfoState } from '@/atom/authAtom'
import { ILoginRequest, ILoginResponse } from '@/domain/auth/type'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { cn } from '@/lib/utils'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)
  const setInfoUser = useSetRecoilState(userInfoState)

  const location = useLocation()
  const navigate = useNavigate()

  const backURL = new URLSearchParams(location.search).get('backUrl')

  const onSuccess = (data: ILoginResponse) => {
    setAccessToken(data.access_token)
    setInfoUser(data.user)
  }

  const { mutate, isPending } = useLogin(onSuccess)

  const onSubmit = async (val: ILoginRequest) => {
    mutate(val)
  }

  useEffect(() => {
    if (accessToken != '') {
      navigate({ to: backURL || '/' })
    }
  }, [accessToken])

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form name='form-login' layout='vertical' onFinish={onSubmit}>
        <Form.Item<ILoginRequest>
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
        <Form.Item<ILoginRequest>
          name='password'
          label='Mật khẩu'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            {
              min: 8,
              message: 'Mật khẩu tối thiểu 8 ký tự',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type='password'
            placeholder='Mật khẩu'
          />
        </Form.Item>
        <Form.Item className='text-right'>
          <Link to='/quen-mat-khau'>Bạn quên mật khẩu?</Link>
        </Form.Item>
        <Button
          disabled={isPending}
          loading={isPending}
          htmlType='submit'
          className='w-full'
          type='primary'
        >
          Đăng nhập
        </Button>
      </Form>
    </div>
  )
}
