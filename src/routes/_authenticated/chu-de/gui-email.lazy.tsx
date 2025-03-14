import { createLazyFileRoute } from '@tanstack/react-router'
import SendEmailNotificationSubjectV from '@/views/SendEmailNotificationSubjectV'

export const Route = createLazyFileRoute('/_authenticated/chu-de/gui-email')({
  component: SendEmailNotificationSubjectV,
})
