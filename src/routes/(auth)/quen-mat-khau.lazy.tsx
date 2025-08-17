import { createLazyFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/views/auth/forgot-password'

export const Route = createLazyFileRoute('/(auth)/quen-mat-khau')({
  component: ForgotPassword,
})
