import { FC, useMemo } from 'react'
import { useGetSubjectShort } from '@/apis/subject/useQuerySubject'
import { ESort } from '@/domain/common'
import { ESubjectStatus } from '@/domain/subject'
import { Divider, Form, FormInstance, Input, Select } from 'antd'
import { isObject } from 'lodash'

interface IProps {
  form: FormInstance
}

const FormRollCall: FC<IProps> = ({ form }) => {
  const { data: subjectToRollCall = [], isLoading: isLoadingSubject } =
    useGetSubjectShort({
      sort: ESort.DESC,
      sort_by: 'start_at',
      status: [
        ESubjectStatus.COMPLETED,
        ESubjectStatus.SENT_EVALUATION,
        ESubjectStatus.SENT_NOTIFICATION,
      ],
    })

  const subjectOptions = useMemo(
    () =>
      subjectToRollCall.map((item) => ({
        value: item.id,
        label: item.code + ' ' + item.title,
      })),
    [subjectToRollCall]
  )
  return (
    <div>
      <div className='mt-4 flex flex-col gap-1'>
        <div>
          <span className='mr-2 font-medium'>B1:</span>
          <a
            className='text-blue-500'
            href='https://docs.google.com/spreadsheets/d/1kbv0Bt9FRqUBaSKGvZk_13RJQBBhiD4fumNeRxrFJvQ/edit?usp=sharing'
            target='_blank'
            rel='noreferrer'
          >
            Truy cập vào đây để lấy mẫu
          </a>
        </div>
        <div>
          <span className='mr-2 font-medium'>B2:</span>
          Tạo bảo sao từ mẫu, có thể tiếp tục sử dụng mẫu điểm danh trước đây.
        </div>
        <div>
          <span className='mr-2 font-medium'>B3:</span>
          Nhập dữ liệu là MSHV tham dự zoom
        </div>
        <div>
          <span className='mr-2 font-medium'>B4:</span>
          Mở quyền xem file và copy link vào bên dưới để chạy
        </div>
        <div className='italic'>
          <span className='mr-2 font-medium'>Lưu ý:</span>
          Khi thực hiện điểm danh trên buổi học đã điểm danh rồi, kết quả cũ sẽ
          bị xóa và thay thế bằng kết quả mới.
        </div>
      </div>
      <Divider />
      <Form layout='vertical' form={form} name='form-import'>
        <Form.Item
          name='url'
          label='Link google spreadsheet'
          rules={[
            {
              required: true,
              type: 'url',
              message: 'Vui lòng nhập link',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='sheet_name'
          label='Tên sheet'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên sheet',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='subject_id'
          label='Môn học'
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select
            placeholder='Môn học'
            options={subjectOptions}
            filterOption={(input, option) =>
              isObject(option) &&
              (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
            }
            showSearch
            loading={isLoadingSubject}
            allowClear
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default FormRollCall
