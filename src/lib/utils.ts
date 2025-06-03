import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState } from '@/atom/seasonAtom'
import { EAdminRole } from '@/domain/admin/type'
import { type ClassValue, clsx } from 'clsx'
import { includes, some } from 'lodash'
import { getRecoil } from 'recoil-nexus'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isSuperAdmin = (requiredActive?: boolean) => {
  const currentSeason = getRecoil(currentSeasonState)
  const userInfo = getRecoil(userInfoState)

  if (userInfo) {
    if (userInfo.roles.includes(EAdminRole.ADMIN)) return true
    if (userInfo.roles.includes(EAdminRole.BDH)) {
      if (requiredActive && userInfo.latest_season !== currentSeason.season)
        return false
      else return true
    }
  }
  return false
}

export const hasMatch = <T>(arrayA: T[], arrayB: T[]): boolean => {
  return some(arrayA, (item) => includes(arrayB, item))
}

export const getRollCallResultBgColor = (result?: string) => {
  if (!result) return '!bg-purple-100/30'
  if (result === 'completed') return ''
  if (result === 'no_complete') return '!bg-green-100/30'
  if (result === 'absent') return '!bg-yellow-100/30'
  return ''
}
