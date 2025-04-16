import { createLazyFileRoute } from '@tanstack/react-router'
import FailedTasks from '@/views/FailedTasks'

export const Route = createLazyFileRoute('/_authenticated/quan-ly-loi-tac-vu')({
  component: FailedTasks,
})
