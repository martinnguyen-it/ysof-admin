import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import { VN_TIMEZONE } from './constants'
import './index.css'
// Generated Routes
import { routeTree } from './routeTree.gen'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(VN_TIMEZONE)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError
        // Only retry for non-404 errors
        if (axiosError?.status === 404) {
          return false // Do not retry for 404 errors
        }
        return failureCount < 3 // Retry up to 3 times for other errors
      },
    },
  },
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <RecoilNexus />
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'inherit',
              },
            }}
          >
            <RouterProvider router={router} />
            <ToastContainer autoClose={3000} />
          </ConfigProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </StrictMode>
  )
}
