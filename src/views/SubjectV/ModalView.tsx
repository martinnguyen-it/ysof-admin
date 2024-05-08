import { VN_TIMEZONE } from '@constants/index'
import { ESubjectStatusDetail } from '@constants/subject'
import { IOpenFormWithMode } from '@domain/common'
import { ISubjectInResponse } from '@domain/subject'
import { Avatar, Card, Divider, Modal, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { isEmpty, size } from 'lodash'
import { Dispatch, FC } from 'react'
import { Link } from 'react-router-dom'

interface IProps {
  open: IOpenFormWithMode<ISubjectInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<ISubjectInResponse>>>
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
              <span>
                {open.item.code} - {open.item.title} (<span className='italic'>{dayjs(open.item.start_at).format('DD-MM-YYYY')}</span>)
              </span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Phân môn:</span>
              <span>{open.item.subdivision}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Câu hỏi gửi giảng viên:</span>
              <span>{open.item?.question_url || 'Chưa có thông tin'}</span>
            </Card>
            <Card>
              <p className='mr-2 inline-block text-base font-medium'>Zoom:</p>
              {!isEmpty(open.item.zoom) ? (
                <>
                  {open.item.zoom?.link && <p>- Link: {open.item.zoom?.link}</p>}
                  {open.item.zoom?.meeting_id && <p>- ID: {open.item.zoom?.meeting_id}</p>}
                  {open.item.zoom?.meeting_id && <p>- Passcode: {open.item.zoom?.pass_code}</p>}
                </>
              ) : (
                <>Chưa có thông tin</>
              )}
            </Card>

            <Card>
              <span className='mr-2 text-base font-medium'>Ngày học:</span>
              <span>{dayjs(open.item.start_at).format('DD-MM-YYYY')}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Trạng thái:</span>
              <span>{ESubjectStatusDetail[open.item.status]}</span>
            </Card>
            {open.item?.attachments && size(open.item.attachments) > 0 && (
              <Card>
                <p className='mb-1 text-base font-medium'>Tài liệu đính kèm:</p>
                <p className='flex flex-wrap gap-2'>
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
                </p>
              </Card>
            )}
            <Card>
              <p className='text-base font-medium'>Mô tả:</p>
              {open.item?.abstract ? <p dangerouslySetInnerHTML={{ __html: open.item.abstract }} /> : '--'}
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Ngày tạo:</span>
              <span>{dayjs.utc(open.item.created_at).tz(VN_TIMEZONE).format('HH:mm DD-MM-YYYY')}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Sửa lần cuối:</span>
              <span>{dayjs.utc(open.item.updated_at).tz(VN_TIMEZONE).format('HH:mm DD-MM-YYYY')}</span>
            </Card>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalView
