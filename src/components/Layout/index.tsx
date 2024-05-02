import { FC, ReactNode, lazy } from 'react'
import { useRecoilValue } from 'recoil'
import { appState } from '@atom/appAtom'

const Header = lazy(() => import('./Header'))
const Sidebar = lazy(() => import('./Sidebar'))

export interface Props {
  className?: string
  children: ReactNode | JSX.Element | JSX.Element[]
}

const Layout: FC<Props> = ({ children, className = '' }: Props) => {
  const { isCollapseSidebar } = useRecoilValue(appState)

  return (
    <>
      <Header />
      <div className={`flex ${className}`}>
        <Sidebar />
        <div
          className={`relative ml-auto min-h-screen bg-[#d8ecef42] pt-12 transition-all duration-200 ease-out ${className} ${
            !isCollapseSidebar ? 'w-right-layout' : 'w-left-sidebar'
          }`}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
