import { createLazyFileRoute } from '@tanstack/react-router'
import LecturerV from '@/views/LecturerV'

export const Route = createLazyFileRoute('/_authenticated/giang-vien')({
  component: LecturerV,
})
