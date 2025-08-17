import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'
import { VerifyCodeResetForm } from './components/reset-password-form'
import { UpdatePasswordForm } from './components/update-password-form'

export default function ForgotPassword() {
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')

  const body = useMemo(() => {
    if (token) return <UpdatePasswordForm token={token} />
    if (email) return <VerifyCodeResetForm email={email} setToken={setToken} />

    return <ForgotForm setEmail={setEmail} />
  }, [token, email])

  return (
    <AuthLayout>
      <Card className='p-6'>{body}</Card>
    </AuthLayout>
  )
}
