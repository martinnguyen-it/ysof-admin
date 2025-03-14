import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-4'>
          <h1 className='text-center text-2xl font-semibold tracking-tight'>
            Đăng nhập
          </h1>
        </div>
        <UserAuthForm />
      </Card>
    </AuthLayout>
  )
}
