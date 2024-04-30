import LoginV from '@views/auth/LoginV'
import { generateRouteElements, IRoute } from './utils'

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
    path: '/login/',
    element: <LoginV />,
    requiredLogin: false,
  },
]

export const routesElm = generateRouteElements(routes)
