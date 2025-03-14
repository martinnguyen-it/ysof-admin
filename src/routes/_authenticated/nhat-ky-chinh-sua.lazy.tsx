import { createLazyFileRoute } from '@tanstack/react-router'
import AuditLogV from '@/views/AuditLogV'

export const Route = createLazyFileRoute('/_authenticated/nhat-ky-chinh-sua')({
  component: AuditLogV,
})
