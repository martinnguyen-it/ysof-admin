import { useRecoilState, useRecoilValue } from 'recoil'
import { routesElm } from './routes'
import { userInfoState } from '@atom/authAtom'
import { currentSeasonState, selectSeasonState } from '@atom/seasonAtom'
import { useEffect } from 'react'
import { EAdminRole } from '@domain/admin/type'

function App() {
  const userInfo = useRecoilValue(userInfoState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [selectSeason, setSelectSeason] = useRecoilState(selectSeasonState)

  useEffect(() => {
    if (userInfo && !selectSeason) {
      if (userInfo.roles.includes(EAdminRole.ADMIN)) setSelectSeason(currentSeason?.season)
      else setSelectSeason(userInfo.current_season)
    }
  }, [userInfo, currentSeason])

  return <div>{routesElm}</div>
}

export default App
