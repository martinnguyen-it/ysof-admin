import { Dispatch, FC } from 'react'
import { EAdminRoleDetail, IAdminInResponse } from '@/domain/admin/type'
import { IOpenFormWithMode } from '@/domain/common'
import { Divider, Modal } from 'antd'

interface IProps {
  open: IOpenFormWithMode<IAdminInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<IAdminInResponse>>>
}

const ModalView: FC<IProps> = ({ open, setOpen }) => {
  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  return (
    <>
      {open.item && (
        <Modal
          title={'Xem'}
          open={open.active}
          onCancel={handleCancel}
          okButtonProps={{ style: { display: 'none' } }}
          cancelText='Đóng'
          okText={false}
          width={800}
        >
          <Divider />
          <div className='flex flex-col text-base'>
            <div className='group relative mx-auto h-32 w-32 overflow-hidden rounded-full border'>
              <img
                src={open.item?.avatar || '/images/avatar.png'}
                referrerPolicy='no-referrer'
                alt='Avatar'
                className='h-32 w-32 object-cover'
              />
            </div>
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <div className='flex items-center'>
                <span className='mr-2 inline-block text-base font-medium'>
                  Họ tên:
                </span>
                <span className='text-wrap font-medium text-blue-500'>
                  {open.item?.holy_name ? open.item.holy_name + ' ' : ''}
                  {open.item.full_name}
                </span>
              </div>

              {open.item?.address && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Quê quán:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.address.original}
                  </span>
                </div>
              )}
              {open.item?.address && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Nơi ở hiện tại:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.address.current}
                  </span>
                </div>
              )}
              {open.item?.address && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Giáo phận:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.address.diocese}
                  </span>
                </div>
              )}

              {open.item?.patronal_day && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Ngày bổn mạng:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.patronal_day}
                  </span>
                </div>
              )}
              {open.item?.date_of_birth && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Ngày sinh:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.date_of_birth}
                  </span>
                </div>
              )}
              {open.item?.phone_number && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Số điện thoại:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.phone_number.join(', ')}
                  </span>
                </div>
              )}
              {open.item?.email && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Email:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.email}
                  </span>
                </div>
              )}
              {open.item?.roles && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Ban:
                  </span>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {open.item.roles
                      .map((role) => EAdminRoleDetail[role])
                      .join(', ')}
                  </span>
                </div>
              )}
              {open.item?.facebook && (
                <div className='flex items-center'>
                  <span className='mr-2 inline-block text-base font-medium'>
                    Facebook:
                  </span>
                  <a
                    href={open.item.facebook}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500'
                  >
                    {open.item.facebook}
                  </a>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalView
