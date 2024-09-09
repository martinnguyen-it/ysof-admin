import { HomeOutlined, LogoutOutlined } from '@ant-design/icons'
import { appState } from '@atom/appAtom'
import { userInfoState } from '@atom/authAtom'
import { handleClearAuthorization } from '@src/services/HTTPService'
import { Avatar, Breadcrumb, Dropdown, MenuProps } from 'antd'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { FC, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

const Header: FC = () => {
  const userInfo = useRecoilValue(userInfoState)
  const [{ menuActive, isCollapseSidebar }, setAppState] = useRecoilState(appState)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    handleClearAuthorization(true)
    navigate('/')
  }

  useEffect(() => {
    const labelTooltip = document.getElementById('label-tooltip')
    if (labelTooltip) {
      const parentElement: any = labelTooltip.parentNode
      if (parentElement) {
        parentElement.remove()
      }
    }
  }, [pathname])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link
          to={'/tai-khoan'}
          onClick={() => {
            setAppState((prev) => ({ ...prev, menuActive: 'Tài khoản' }))
          }}
        >
          <Avatar src={userInfo?.avatar || '/images/avatar.png'} size={28} /> {userInfo?.full_name || ''}
        </Link>
      ),
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleSignOut,
    },
  ]

  const breadcrumbItems = useMemo(() => {
    const items: ItemType[] = [
      {
        title: (
          <Link
            onClick={() => {
              setAppState((prev) => ({ ...prev, menuActive: '' }))
            }}
            to='/'
          >
            <HomeOutlined size={20} />
          </Link>
        ),
      },
    ]
    if (menuActive && menuActive != 'Bảng tin') items.push({ title: menuActive })
    return items
  }, [menuActive])

  return (
    <>
      <div className='fixed z-10 w-full border-b bg-white pr-8 shadow-sm'>
        <div className='flex h-12 items-center justify-between'>
          <Breadcrumb className={`flex cursor-pointer items-center pl-5 text-base font-medium  ${isCollapseSidebar ? 'ml-14' : 'ml-60'}`} items={breadcrumbItems} />

          <div className='flex items-center gap-3' id='dropdown'>
            <Dropdown menu={{ items }} placement='bottomRight' arrow>
              <Avatar src={userInfo?.avatar || '/images/avatar.png'} size={28} />
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
