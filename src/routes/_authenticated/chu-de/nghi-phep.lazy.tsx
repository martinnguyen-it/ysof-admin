import { createLazyFileRoute } from '@tanstack/react-router'
import SubjectAbsentV from '@/views/SubjectAbsentV'

export const Route = createLazyFileRoute('/_authenticated/chu-de/nghi-phep')({
  component: SubjectAbsentV,
})
