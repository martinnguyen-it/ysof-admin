import { FC } from 'react'
import { Divider, Form, FormInstance, Input } from 'antd'

interface IProps {
  form: FormInstance
}

const FormImport: FC<IProps> = ({ form }) => {
  return (
    <div>
      <div className='mt-4 flex flex-col gap-1'>
        <div>
          <span className='mr-2 font-medium'>B1:</span>
          <a
            className='text-blue-500'
            href='https://docs.google.com/spreadsheets/d/1T3Z1nMr_gW2KcjU4AG-IGwZYRLMbvpSFqHOiRHLAgDs/edit?usp=sharing'
            target='_blank'
            rel='noreferrer'
          >
            Truy cập vào đây để lấy mẫu
          </a>
        </div>
        <div>
          <span className='mr-2 font-medium'>B2:</span>
          Tạo bảo sao từ mẫu
        </div>
        <div>
          <span className='mr-2 font-medium'>B3:</span>
          Nhập dữ liệu theo đúng các cột trong mẫu
        </div>
        <div>
          <span className='mr-2 font-medium'>B4:</span>
          Xóa dòng tiếng Việt số 1
        </div>
        <div>
          <span className='mr-2 font-medium'>B5:</span>
          Mở quyền xem file và copy link vào bên dưới để chạy
        </div>
        <div className='italic'>
          <span className='mr-2 font-medium'>Lưu ý:</span>
          Mỗi học viên import thành công sẽ nhận được một email thông báo tài
          khoản đăng nhập.
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
      </Form>
    </div>
  )
}

export default FormImport
