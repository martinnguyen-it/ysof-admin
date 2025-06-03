import { createLazyFileRoute } from '@tanstack/react-router'
import RollCallResultV from '@/views/RollCallResultV'

export const Route = createLazyFileRoute(
  '/_authenticated/chu-de/ket-qua-diem-danh'
)({
  component: RollCallResultV,
})
