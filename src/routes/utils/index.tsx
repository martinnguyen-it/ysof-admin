import { accessTokenState } from '@atom/authAtom'
import React from 'react'
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

export interface IRoute {
  path: string
  element: React.ReactNode
  requiredLogin: boolean
  Layout?: React.FC<any> | React.FunctionComponent<any>
}

export function generateRouteElements(routes: IRoute[]) {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => {
          let Element = route.element
          if (route.Layout) {
            Element = <route.Layout>{Element}</route.Layout>
          }
          if (route.requiredLogin) {
            Element = <RequiredLoginRoute>{Element}</RequiredLoginRoute>
          }
          return <Route key={route.path} path={route.path} element={Element} />
        })}
      </Routes>
    </BrowserRouter>
  )
}

function RequiredLoginRoute(props: { children: React.ReactNode }) {
  const accessToken = useRecoilValue(accessTokenState)
  if (!accessToken) {
    return <Navigate to='/login/' replace />
  } else {
    return <>{props.children}</>
  }
}
