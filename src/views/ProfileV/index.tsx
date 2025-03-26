import { FC } from 'react'
import { Divider } from 'antd'
import UpdateAvatar from './UpdateAvatar'
import UpdateInfo from './UpdateInfo'
import UpdatePassword from './UpdatePassword'

const ProfileV: FC = () => {
  return (
    <div className='rounded-xl bg-white px-10 py-6 shadow-lg'>
      <div className='mb-4 flex justify-center text-2xl font-bold'>
        CẬP NHẬT THÔNG TIN
      </div>
      <UpdateAvatar />

      <UpdateInfo />
      <Divider />
      <UpdatePassword />
    </div>
  )
}

export default ProfileV
