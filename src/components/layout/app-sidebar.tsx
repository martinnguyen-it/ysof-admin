import { useMemo } from 'react'
import { useGetListSeasons } from '@/apis/season/useQuerySeason'
import { userInfoState } from '@/atom/authAtom'
import { selectSeasonState } from '@/atom/seasonAtom'
import { Select } from 'antd'
import { isArray } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { cn, isSuperAdmin } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { sidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userInfo = useRecoilValue(userInfoState)
  const [selectSeason, setSelectSeason] = useRecoilState(selectSeasonState)

  const { data: listSeason, isLoading } = useGetListSeasons({
    sort_by: 'season',
  })
  const { open } = useSidebar()

  const optionSeasons = useMemo(() => {
    if (userInfo && isArray(listSeason)) {
      if (isSuperAdmin(true)) {
        return listSeason.map((item) => ({
          value: item.season,
          label: item.season,
        }))
      }
      return listSeason
        .filter((item) => item.season <= userInfo.latest_season)
        .map((item) => ({ value: item.season, label: item.season }))
    }
    return []
  }, [listSeason, userInfo])

  const handleChangeSeason = (val: string) => {
    setSelectSeason(Number(val))
  }
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <div
          className={cn(
            'mt-2 flex w-full items-center justify-center text-sidebar-accent-foreground md:mt-0',
            open && 'gap-2'
          )}
        >
          <img alt='' className='size-8 rounded-md' src='/logo128.png' />
          <p className='truncate font-semibold'>YSOF</p>
        </div>
        <div
          className={cn(
            'h-12 items-center justify-center gap-4',
            open ? 'flex' : 'mx-auto'
          )}
        >
          {open ? <span className='font-bold'>MÙA</span> : null}
          <Select
            value={(selectSeason && String(selectSeason)) || ''}
            style={{ width: 35, textAlign: 'center' }}
            onChange={handleChangeSeason}
            options={optionSeasons}
            suffixIcon={null}
            loading={isLoading}
            className='select-season'
            popupClassName='select-season'
          />
        </div>
      </SidebarHeader>
      <SidebarContent className='gap-0'>
        {sidebarData.map((props) => (
          <NavGroup key={props.title} item={props} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
