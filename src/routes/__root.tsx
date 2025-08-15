import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import GeneralError from '@/views/errors/general-error'
import NotFoundError from '@/views/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  notFoundComponent: NotFoundError,
  errorComponent: import.meta.env.MODE === 'development' ? false : GeneralError,
})
