import { createLazyFileRoute } from '@tanstack/react-router'
import GeneralError from '@/views/errors/general-error'

export const Route = createLazyFileRoute('/(errors)/500')({
  component: GeneralError,
})
