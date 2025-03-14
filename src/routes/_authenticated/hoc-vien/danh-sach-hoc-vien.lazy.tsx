import { createLazyFileRoute } from '@tanstack/react-router'
import StudentV from '@/views/StudentV'

export const Route = createLazyFileRoute(
  '/_authenticated/hoc-vien/danh-sach-hoc-vien'
)({
  component: StudentV,
})
