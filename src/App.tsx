import { useRecoilState, useRecoilValue } from 'recoil'
import { routesElm } from './routes'
import { userInfoState } from '@atom/authAtom'
import { selectSeasonState } from '@atom/seasonAtom'
import { useEffect } from 'react'

function App() {
  const userInfo = useRecoilValue(userInfoState)
  const [selectSeason, setSelectSeason] = useRecoilState(selectSeasonState)

  useEffect(() => {
    if (userInfo && !selectSeason) setSelectSeason(userInfo.current_season)
  }, [userInfo])
  return <div>{routesElm}</div>
}

export default App
