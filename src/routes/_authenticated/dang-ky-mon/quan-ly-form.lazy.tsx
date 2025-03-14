import { createLazyFileRoute } from '@tanstack/react-router'
import ManageSubjectRegistrationV from '@/views/registration/ManageSubjectRegistrationV'

export const Route = createLazyFileRoute(
  '/_authenticated/dang-ky-mon/quan-ly-form'
)({
  component: ManageSubjectRegistrationV,
})
