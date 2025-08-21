import { Dispatch, FC } from 'react'
import { Link } from '@tanstack/react-router'
import { EAdminRoleDetail } from '@/domain/admin/type'
import { IOpenFormWithMode } from '@/domain/common'
import { IGeneralTaskInResponse } from '@/domain/generalTask'
import { Avatar, Card, Divider, Modal, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { size } from 'lodash'
import { Link2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { EGeneralTaskTypeDetail } from '@/constants/generalTask'

interface IProps {
  open: IOpenFormWithMode<IGeneralTaskInResponse>
  setOpen: Dispatch<
    React.SetStateAction<IOpenFormWithMode<IGeneralTaskInResponse>>
  >
  onClose?: () => void
  data?: IGeneralTaskInResponse
}

const ModalView: FC<IProps> = ({ open, setOpen, onClose, data }) => {
  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      setOpen({ active: false, mode: 'add' })
    }
  }

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      toast.success('Đã sao chép liên kết')
    } catch (_error) {
      toast.error('Sao chép liên kết thất bại')
    }
  }

  const taskData = data || open.item

  return (
    <>
      {taskData && (
        <Modal
          title={
            <div className='flex items-center gap-2'>
              <span>Xem</span>
              <Tooltip title='Sao chép liên kết'>
                <button
                  type='button'
                  aria-label='Sao chép liên kết'
                  className='inline-flex items-center justify-center rounded p-1 hover:bg-slate-100'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyLink()
                  }}
                >
                  <Link2 className='size-4' />
                </button>
              </Tooltip>
            </div>
          }
          open={open.active}
          onCancel={handleCancel}
          cancelText='Đóng'
          okButtonProps={{ style: { display: 'none' } }}
          okText={false}
          width={'80%'}
        >
          <Divider />
          <div className='flex flex-col gap-4 text-base'>
            <Card>
              <span className='mr-2 text-base font-medium'>Tiêu đề:</span>
              <span>{taskData.title}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Quản lý:</span>
              <span>{EAdminRoleDetail[taskData.role]}</span>
            </Card>
            <Card>
              <div className='flex items-center'>
                <p className='mr-2 inline-block text-base font-medium'>
                  Người tạo:
                </p>
                <p>
                  <Avatar.Group className='flex items-center'>
                    <img
                      className='mr-4 size-7 rounded-full object-cover'
                      referrerPolicy='no-referrer'
                      src={taskData.author.avatar || '/images/avatar.png'}
                    ></img>
                    <p className='text-wrap font-medium text-blue-500'>
                      {taskData.author.full_name}
                    </p>
                  </Avatar.Group>
                </p>
              </div>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>
                Loại công việc:
              </span>
              <span>{EGeneralTaskTypeDetail[taskData.type]}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Ngày bắt đầu:</span>
              <span>{dayjs(taskData.start_at).format('DD-MM-YYYY')}</span>
              {taskData?.end_at && (
                <>
                  <span className='mx-5 inline-block text-base font-medium'>
                    -
                  </span>
                  <span className='mr-2 text-base font-medium'>
                    Ngày kết thúc:
                  </span>
                  <span>{dayjs(taskData.end_at).format('DD-MM-YYYY')}</span>
                </>
              )}
            </Card>
            {size(taskData.label) > 0 && (
              <Card>
                <span className='mr-2 text-base font-medium'>Nhãn:</span>
                <span>{taskData.label?.join(', ')}</span>
              </Card>
            )}
            {taskData?.short_desc && (
              <Card>
                <p className='text-base font-medium'>Mô tả ngắn:</p>
                <p>{taskData?.short_desc}</p>
              </Card>
            )}
            {taskData?.attachments && size(taskData.attachments) > 0 && (
              <Card>
                <p className='mb-1 text-base font-medium'>Tài liệu đính kèm:</p>
                <div className='flex flex-wrap gap-2'>
                  {taskData.attachments.map((item) => (
                    <Tooltip
                      key={item.id}
                      placement='bottom'
                      title='Nhấn vào đây để xem file'
                    >
                      <Card size='small' className='!w-fit'>
                        <Avatar.Group className='flex items-center'>
                          <img
                            className='mr-4 size-7 object-cover'
                            src={`https://drive-thirdparty.googleusercontent.com/64/type/${item?.mimeType}`}
                          ></img>
                          <Link
                            to={item.webViewLink}
                            target='_blank'
                            className='text-wrap font-medium text-blue-500'
                          >
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
              <p dangerouslySetInnerHTML={{ __html: taskData.description }} />
            </Card>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalView
