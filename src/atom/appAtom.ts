import { IAppState } from '@domain/app'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const appState = atom<IAppState>({
  key: 'app',
  default: { isCollapseSidebar: false },
  effects_UNSTABLE: [persistAtom],
})
