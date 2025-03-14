import { createLazyFileRoute } from '@tanstack/react-router'
import GeneralTaskV from '@/views/GeneralTaskV'

export const Route = createLazyFileRoute('/_authenticated/cong-viec-chung')({
  component: GeneralTaskV,
})
