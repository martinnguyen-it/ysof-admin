import { Dispatch, FC } from 'react'
import { IOpenFormWithMode } from '@/domain/common'
import { ILecturerInResponse } from '@/domain/lecturer'
import { Avatar, Card, Divider, Modal } from 'antd'

interface IProps {
  open: IOpenFormWithMode<ILecturerInResponse>
  setOpen: Dispatch<
    React.SetStateAction<IOpenFormWithMode<ILecturerInResponse>>
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
                    {open.item?.avatar && (
                      <img
                        className='mr-4 size-7 object-cover'
                        src={open.item.avatar}
                      ></img>
                    )}
                    <p className='text-wrap font-medium text-blue-500'>
                      {open.item?.title ? open.item.title + ' ' : ''}
                      {open.item?.holy_name ? open.item.holy_name + ' ' : ''}
                      {open.item.full_name}
                    </p>
                  </Avatar.Group>
                </p>
              </div>
            </Card>
            {open.item?.information && (
              <Card>
                <p className='mr-2 text-base font-medium'>Thông tin cơ bản:</p>
                <div style={{ whiteSpace: 'pre-line' }}>
                  {open.item.information}
                </div>
              </Card>
            )}
            {open.item?.contact && (
              <Card>
                <p className='mr-2 text-base font-medium'>Thông tin liên hệ:</p>
                <div style={{ whiteSpace: 'pre-line' }}>
                  {open.item.contact}
                </div>
              </Card>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalView
