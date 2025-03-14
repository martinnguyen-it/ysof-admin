import { Dispatch, FC } from 'react'
import { EAdminRoleDetail } from '@/domain/admin/type'
import { IAuditLogInResponse } from '@/domain/auditLog'
import { IOpenFormWithMode } from '@/domain/common'
import { Avatar, Card, Divider, Modal } from 'antd'

interface IProps {
  open: IOpenFormWithMode<IAuditLogInResponse>
  setOpen: Dispatch<
    React.SetStateAction<IOpenFormWithMode<IAuditLogInResponse>>
  >
}

const ModalView: FC<IProps> = ({ open, setOpen }) => {
  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  return (
    <>
      {open.item && (
        <Modal
          width={'60%'}
          title={'Xem'}
          open={open.active}
          onCancel={handleCancel}
          okButtonProps={{ style: { display: 'none' } }}
          cancelText='Đóng'
          okText={false}
        >
          <Divider />
          <div className='flex flex-col gap-4 text-base'>
            <Card>
              <div className='flex items-center'>
                <p className='mr-2 inline-block text-base font-medium'>
                  Họ tên:
                </p>
                <p>
                  <Avatar.Group className='flex items-center'>
                    {open.item?.author?.avatar && (
                      <img
                        className='mr-4 size-7 object-cover'
                        src={open.item?.author?.avatar}
                      ></img>
                    )}
                    <p className='text-wrap font-medium text-blue-500'>
                      {open.item?.author
                        ? open.item.author.holy_name +
                          ' ' +
                          open.item.author.full_name
                        : open.item.author_name}
                    </p>
                  </Avatar.Group>
                </p>
              </div>
            </Card>
            <Card>
              <div className='flex items-center'>
                <p className='mr-2 inline-block text-base font-medium'>
                  Thuộc ban:
                </p>
                <p>
                  {open.item?.author_roles
                    .map((item) => EAdminRoleDetail[item])
                    .join(', ')}
                </p>
              </div>
            </Card>
            <Card>
              <div className='flex items-center'>
                <p className='mr-2 inline-block text-base font-medium'>Loại:</p>
                <p>{open.item?.type}</p>
              </div>
              <div className='flex items-center'>
                <p className='mr-2 inline-block text-base font-medium'>
                  Endpoint:
                </p>
                <p>{open.item?.endpoint}</p>
              </div>
            </Card>
            <Card>
              <p className='mr-2 inline-block text-base font-medium'>
                Nội dung cập nhật:
              </p>
              <p className='break-all'>
                <pre className='whitespace-pre-wrap'>
                  {JSON.stringify(
                    JSON.parse(open.item?.description || ''),
                    null,
                    4
                  )}
                </pre>
              </p>
            </Card>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalView
