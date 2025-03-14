import { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState, selectSeasonState } from '@/atom/seasonAtom'
import { EAdminRole } from '@/domain/admin/type'
import { size } from 'lodash'
import { ChevronRight } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { hasMatch, isSuperAdmin } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { NavCollapsible, NavItem, NavLink } from './types'

export function NavGroup({ item }: { item: NavItem }) {
  const href = useLocation({ select: (location) => location.href })
  const userInfo = useRecoilValue(userInfoState)
  const selectSeason = useRecoilValue(selectSeasonState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const userRoles = userInfo?.roles

  if (
    !(
      (!item.roles ||
        (item.roles && userRoles && hasMatch(item.roles, userRoles))) &&
      !(item.requiredCurrent && selectSeason !== currentSeason?.season)
    )
  )
    return null

  return (
    <SidebarGroup>
      <SidebarMenu>
        {!('items' in item) ? (
          <SidebarMenuLink item={item} href={href} />
        ) : (
          <SidebarMenuWithChild item={item} href={href} />
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
)

const SidebarMenuWithChild = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const { state } = useSidebar()

  return state === 'collapsed' ? (
    <SidebarMenuCollapsedDropdown item={item} href={href} />
  ) : (
    <SidebarMenuCollapsible item={item} href={href} />
  )
}

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const { setOpenMobile } = useSidebar()
  const userInfo = useRecoilValue(userInfoState)
  const selectSeason = useRecoilValue(selectSeasonState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const userRoles = userInfo?.roles

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) =>
              (!subItem.roles ||
                (subItem.roles &&
                  userRoles &&
                  hasMatch(subItem.roles, userRoles)) ||
                (!(
                  size(subItem?.roles) &&
                  subItem.roles.includes(EAdminRole.ADMIN)
                ) &&
                  isSuperAdmin(true))) &&
              !(
                subItem?.requiredCurrent &&
                selectSeason !== currentSeason?.season
              ) ? (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={checkIsActive(href, subItem)}
                  >
                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ) : null
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const userInfo = useRecoilValue(userInfoState)
  const selectSeason = useRecoilValue(selectSeasonState)
  const currentSeason = useRecoilValue(currentSeasonState)
  const userRoles = userInfo?.roles

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) =>
            (!sub.roles ||
              (sub.roles && userRoles && hasMatch(sub.roles, userRoles)) ||
              (!(size(sub?.roles) && sub.roles.includes(EAdminRole.ADMIN)) &&
                isSuperAdmin(true))) &&
            !(
              sub?.requiredCurrent && selectSeason !== currentSeason?.season
            ) ? (
              <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                <Link
                  to={sub.url}
                  className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                >
                  {sub.icon && <sub.icon />}
                  <span className='max-w-52 text-wrap'>{sub.title}</span>
                  {sub.badge && (
                    <span className='ml-auto text-xs'>{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            ) : null
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    ('items' in item && !!item.items.filter((i) => i.url === href).length) || // if child nav is active
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
