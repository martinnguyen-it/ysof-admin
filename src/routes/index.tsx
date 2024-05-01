import LoginV from '@views/auth/LoginV'
import { generateRouteElements, IRoute } from './utils'
import ResetPasswordV from '@views/auth/ForgotPasswordV'
import ForgotPasswordV from '@views/auth/ForgotPasswordV'
import Layout from '@components/Layout'
import { lazy } from 'react'
// import { withLoading } from '@src/hocs/withLoading.hoc'

const DashboardV = lazy(() => import('@views/DashboardV'))

// const DashboardPage = withLoading(DashboardV)

export const routes: IRoute[] = [
  //   // {
  //   //   path: '/',
  //   //   element: <HomeScreen />,
  //   //   requiredLogin: false,
  //   //   Layout: DashboardLayout,
  //   // },
  {
    path: '/',
    element: <DashboardV />,
    requiredLogin: true,
    Layout: Layout,
  },
  {
    path: '*',
    element: <DashboardV />,
    requiredLogin: true,
    Layout: Layout,
  },
  {
    path: '/auth/login',
    element: <LoginV />,
    requiredLogin: false,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPasswordV />,
    requiredLogin: false,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPasswordV />,
    requiredLogin: false,
  },
]

export const routesElm = generateRouteElements(routes)
