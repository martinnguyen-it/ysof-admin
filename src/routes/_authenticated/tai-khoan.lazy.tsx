import { createLazyFileRoute } from '@tanstack/react-router'
import ProfileV from '@/views/ProfileV'

export const Route = createLazyFileRoute('/_authenticated/tai-khoan')({
  component: ProfileV,
})
