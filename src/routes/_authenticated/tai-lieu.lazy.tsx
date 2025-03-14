import { createLazyFileRoute } from '@tanstack/react-router'
import DocumentV from '@/views/DocumentV'

export const Route = createLazyFileRoute('/_authenticated/tai-lieu')({
  component: DocumentV,
})
