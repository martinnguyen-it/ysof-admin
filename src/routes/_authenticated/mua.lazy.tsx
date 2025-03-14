import { createLazyFileRoute } from '@tanstack/react-router'
import SeasonV from '@/views/SeasonV'

export const Route = createLazyFileRoute('/_authenticated/mua')({
  component: SeasonV,
})
