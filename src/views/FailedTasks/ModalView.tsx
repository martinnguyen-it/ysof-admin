import { Dispatch, FC } from 'react'
import { IOpenFormWithMode } from '@/domain/common'
import { IFailedTask } from '@/domain/failedTasks'
import { Card, Divider, Modal } from 'antd'

interface IProps {
  open: IOpenFormWithMode<IFailedTask>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<IFailedTask>>>
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
              <span className='mr-2 text-base font-medium'>Tên tác vụ:</span>
              <span>{open.item.name}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Loại:</span>
              <span>{open.item.tag}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Mô tả:</span>
              <span>{open.item.description}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Mô tả:</span>
              <span>{open.item.description}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Dấu vết lỗi:</span>
              <pre className='overflow-auto rounded bg-gray-100 p-2 text-sm'>
                {open.item.traceback}
              </pre>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>
                Ngày thực hiện:
              </span>
              <span>{open.item.date_done?.toLocaleString()}</span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>
                Ngày chỉnh sửa:
              </span>
              <span>
                {open.item.updated_at
                  ? open.item.updated_at.toLocaleString()
                  : 'Chưa được cập nhật'}
              </span>
            </Card>
            <Card>
              <span className='mr-2 text-base font-medium'>Trạng thái:</span>
              <span>
                {open.item.resolved ? (
                  <span className='font-semibold text-green-500'>Đã xử lý</span>
                ) : (
                  <span className='font-semibold text-red-500'>Chưa xử lý</span>
                )}
              </span>
            </Card>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalView
