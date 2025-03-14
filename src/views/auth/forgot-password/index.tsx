import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'

export default function ForgotPassword() {
  // eslint-disable-next-line no-console
  console.log(
    '🚀 ~ ForgotPassword ~ import.meta.env.VITE_MAIL_TO_YSOF:',
    import.meta.env.VITE_MAIL_TO_YSOF
  )
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-center text-2xl font-semibold tracking-tight'>
            Quên mật khẩu
          </h1>
          <p className='text-sm text-muted-foreground'>
            Nhập email của bạn, hệ thống sẽ gửi bạn đường dẫn để đặt lại mật
            khẩu
          </p>
        </div>
        <ForgotForm />
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
      </Card>
    </AuthLayout>
  )
}
