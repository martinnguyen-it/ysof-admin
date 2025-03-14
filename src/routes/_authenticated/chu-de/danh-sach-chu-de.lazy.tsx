import { createLazyFileRoute } from '@tanstack/react-router'
import SubjectV from '@/views/SubjectV'

export const Route = createLazyFileRoute(
  '/_authenticated/chu-de/danh-sach-chu-de'
)({
  component: SubjectV,
})
