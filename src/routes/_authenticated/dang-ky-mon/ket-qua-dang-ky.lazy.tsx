import { createLazyFileRoute } from '@tanstack/react-router'
import ListSubjectRegistrationV from '@/views/registration/ListSubjectRegistrationV'

export const Route = createLazyFileRoute(
  '/_authenticated/dang-ky-mon/ket-qua-dang-ky'
)({
  component: ListSubjectRegistrationV,
})
