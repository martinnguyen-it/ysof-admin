import { EGeneralTaskTypeDetail } from '@constants/generalTask'
import { EAdminRoleDetail } from '@domain/admin/type'
import { IOpenFormWithMode } from '@domain/common'
import { IGeneralTaskInResponse } from '@domain/generalTask'
import { Avatar, Card, Divider, Modal, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { size } from 'lodash'
import { Dispatch, FC } from 'react'
import { Link } from 'react-router-dom'

interface IProps {
  open: IOpenFormWithMode<IGeneralTaskInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<IGeneralTaskInResponse>>>
}

const ModalView: FC<IProps> = ({ open, setOpen }) => {
  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  return (
    <>
      {open.item && (
        <Modal title={'Xem'} open={open.active} onCancel={handleCancel} cancelText='Đóng' okButtonProps={{ style: { display: 'none' } }} okText={false} width={'80%'}>
          <Divider />
          <div className='flex flex-col gap-4 text-base'>
            <Card>
              <span className='mr-2 text-base font-medium'>Tiêu đề:</span>
              <span>{open.item.title}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Quản lý:</span>
              <span>{EAdminRoleDetail[open.item.role]}</span>
            </Card>
            <Card>
              <div className='flex items-center'>
                <p className='mr-2 inline-block text-base font-medium'>Người tạo:</p>
                <p>
                  <Avatar.Group className='flex items-center'>
                    <img className='mr-4 size-7 object-cover' src={open.item.author.avatar || '/images/avatar.png'}></img>
                    <p className='text-wrap font-medium text-blue-500'>{open.item.author.full_name}</p>
                  </Avatar.Group>
                </p>
              </div>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Loại công việc:</span>
              <span>{EGeneralTaskTypeDetail[open.item.type]}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Ngày bắt đầu:</span>
              <span>{dayjs(open.item.start_at).format('DD-MM-YYYY')}</span>
              {open.item?.end_at && (
                <>
                  <span className='mx-5 inline-block text-base font-medium'>-</span>
                  <span className='mr-2 text-base font-medium'>Ngày kết thúc:</span>
                  <span>{dayjs(open.item.end_at).format('DD-MM-YYYY')}</span>
                </>
              )}
            </Card>
            {size(open.item.label) > 0 && (
              <Card>
                <span className='mr-2 text-base font-medium'>Nhãn:</span>
                <span>{open.item.label?.join(', ')}</span>
              </Card>
            )}
            {open.item?.short_desc && (
              <Card>
                <p className='text-base font-medium'>Mô tả ngắn:</p>
                <p>{open.item?.short_desc}</p>
              </Card>
            )}
            {open.item?.attachments && size(open.item.attachments) > 0 && (
              <Card>
                <p className='mb-1 text-base font-medium'>Tài liệu đính kèm:</p>
                <div className='flex flex-wrap gap-2'>
                  {open.item.attachments.map((item) => (
                    <Tooltip key={item.id} placement='bottom' title='Nhấn vào đây để xem file'>
                      <Card size='small' className='!w-fit'>
                        <Avatar.Group className='flex items-center'>
                          <img className='mr-4 size-7 object-cover' src={`https://drive-thirdparty.googleusercontent.com/64/type/${item?.mimeType}`}></img>
                          <Link to={item.webViewLink} target='_blank' className='text-wrap font-medium text-blue-500'>
                            {item.name}
                          </Link>
                        </Avatar.Group>
                      </Card>
                    </Tooltip>
                  ))}
                </div>
              </Card>
            )}
            <Card>
              <p className='text-base font-medium'>Mô tả:</p>
              <p dangerouslySetInnerHTML={{ __html: open.item.description }} />
            </Card>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalView
