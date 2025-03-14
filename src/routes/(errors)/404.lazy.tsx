import { createLazyFileRoute } from '@tanstack/react-router'
import NotFoundError from '@/views/errors/not-found-error'

export const Route = createLazyFileRoute('/(errors)/404')({
  component: NotFoundError,
})
