import { accessTokenState, userInfoState } from '@atom/authAtom'
import { currentSeasonState, selectSeasonState } from '@atom/seasonAtom'
import { getMe } from '@src/services/admin'
import { getCurrentSeason } from '@src/services/season'
import { isEmpty } from 'lodash'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export interface IRoute {
  path: string
  element: React.ReactNode
  requiredLogin: boolean
  Layout?: React.FC<any> | React.FunctionComponent<any>
  requiredCurrent?: boolean
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
            Element = <RequiredLoginRoute requiredCurrent={route?.requiredCurrent}>{Element}</RequiredLoginRoute>
          }
          return <Route key={route.path} path={route.path} element={Element} />
        })}
      </Routes>
    </BrowserRouter>
  )
}

const RequiredLoginRoute = (props: { children: React.ReactNode; requiredCurrent?: boolean }) => {
  const accessToken = useRecoilValue(accessTokenState)
  const setUserInfo = useSetRecoilState(userInfoState)
  const [currentSeason, setCurrentSeason] = useRecoilState(currentSeasonState)
  const selectSeason = useRecoilValue(selectSeasonState)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken)
      (async () => {
        const data = await getMe()
        const currentSeason = await getCurrentSeason()
        if (!isEmpty(data)) setUserInfo(data)
        if (!isEmpty(currentSeason)) setCurrentSeason(currentSeason)
      })()
  }, [accessToken])

  useEffect(() => {
    if (props?.requiredCurrent && selectSeason && currentSeason && selectSeason !== currentSeason?.season) {
      navigate('/')
    }
  }, [props, currentSeason, selectSeason])

  if (!accessToken) {
    return <Navigate to={`/auth/login${location.pathname !== '/' ? `?back_url=${location.pathname}` : ''}`} replace />
  }
  return <>{props.children}</>
}
