import { createLazyFileRoute } from '@tanstack/react-router'
import AdminV from '@/views/AdminV'

export const Route = createLazyFileRoute('/_authenticated/ban-to-chuc')({
  component: AdminV,
})
