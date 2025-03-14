import { createFileRoute } from '@tanstack/react-router'
import GeneralError from '@/views/errors/general-error'

export const Route = createFileRoute('/(auth)/500')({
  component: GeneralError,
})
