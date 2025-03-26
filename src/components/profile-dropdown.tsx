import { Link, useNavigate } from '@tanstack/react-router'
import { userInfoState } from '@/atom/authAtom'
import { handleClearAuthorization } from '@/services/HTTPService'
import { useRecoilValue } from 'recoil'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ProfileDropdown() {
  const navigate = useNavigate()
  const userInfo = useRecoilValue(userInfoState)

  const handleSignOut = () => {
    handleClearAuthorization(true)
    navigate({ to: '/' })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={userInfo?.avatar || '/images/avatar.png'}
              alt='@avatar'
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {userInfo?.full_name}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {userInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/tai-khoan'>Tài khoản</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
