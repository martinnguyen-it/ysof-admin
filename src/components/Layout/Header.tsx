import { LogoutOutlined } from '@ant-design/icons'
import { userInfoState } from '@atom/authAtom'
import { handleClearAuthorization } from '@src/services/HTTPService'
import { Avatar, Button, Dropdown, Menu, MenuProps, Tooltip } from 'antd'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const Header: FC = () => {
  const userInfo = useRecoilValue(userInfoState)

  const { pathname } = useLocation()

  const handleSignOut = async () => {
    handleClearAuthorization(true)
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
        <>
          <Avatar src={userInfo?.avatar || '/images/avatar.png'} size={28} /> {userInfo?.full_name || ''}
        </>
      ),
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleSignOut,
    },
  ]

  return (
    <>
      <div className='fixed z-[1] w-full border-b bg-white pr-8 shadow-sm'>
        <div className='flex h-12 items-center justify-end'>
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
