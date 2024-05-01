import LoginV from '@views/auth/LoginV'
import { generateRouteElements, IRoute } from './utils'
import ResetPasswordV from '@views/auth/ForgotPasswordV'
import ForgotPasswordV from '@views/auth/ForgotPasswordV'

// // Layouts
// import { AuthLayout } from '@src/layouts'

// // Screens
// import { LoginScreen } from '@src/screens'

export const routes: IRoute[] = [
  //   // {
  //   //   path: '/',
  //   //   element: <HomeScreen />,
  //   //   requiredLogin: false,
  //   //   Layout: DashboardLayout,
  //   // },
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
