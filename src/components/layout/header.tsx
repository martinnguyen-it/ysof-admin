import React, { useMemo } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { HomeOutlined } from '@ant-design/icons'
import Breadcrumb, { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)
  const { pathname } = useLocation()

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  const breadcrumbItems = useMemo(() => {
    const items: ItemType[] = [
      {
        title: (
          <Link to='/'>
            <HomeOutlined size={20} />
          </Link>
        ),
      },
    ]

    if (pathname === '/tai-khoan') {
      items.push({ title: 'Tài khoản' })
      return items
    }

    for (const val of sidebarData) {
      if ('items' in val) {
        const target = val.items.find((x) => x.url === pathname)
        if (target) {
          items.push({ title: val.title })
          items.push({ title: target.title })
          break
        }
      } else {
        if (val.url === pathname) {
          items.push({ title: val.title })
          break
        }
      }
    }

    return items
  }, [pathname])

  return (
    <header
      className={cn(
        'flex h-16 items-center gap-3 bg-background p-4 sm:gap-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
      <Separator orientation='vertical' className='h-6' />
      <Breadcrumb
        className={`flex cursor-pointer items-center text-sm font-medium`}
        items={breadcrumbItems}
      />
      {children}
    </header>
  )
}

Header.displayName = 'Header'
