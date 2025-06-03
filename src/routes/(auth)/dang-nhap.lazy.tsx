import { createLazyFileRoute } from '@tanstack/react-router'
import SignIn from '@/views/auth/sign-in'

export const Route = createLazyFileRoute('/(auth)/dang-nhap')({
  component: SignIn,
})
