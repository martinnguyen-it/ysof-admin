import { accessTokenState, userInfoState } from '@atom/authAtom'
import { getMe } from '@src/services/admin'
import { isEmpty } from 'lodash'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'

export interface IRoute {
  path: string
  element: React.ReactNode
  requiredLogin: boolean
  Layout?: React.FC<any> | React.FunctionComponent<any>
}

export const generateRouteElements = (routes: IRoute[]) => {
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

const RequiredLoginRoute = (props: { children: React.ReactNode }) => {
  const accessToken = useRecoilValue(accessTokenState)
  const setUserInfo = useSetRecoilState(userInfoState)
  useEffect(() => {
    if (accessToken)
      (async () => {
        const data = await getMe()
        if (!isEmpty(data)) setUserInfo(data)
      })()
  }, [accessToken])
  if (!accessToken) {
    return <Navigate to='/auth/login' replace />
  } else {
    return <>{props.children}</>
  }
}
