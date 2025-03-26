import { useUpdatePassword } from '@/apis/auth/useUpdatePassword'
import { Button, Form, Input } from 'antd'
import { toast } from 'react-toastify'

const UpdatePassword = () => {
  const [formChangePassword] = Form.useForm()

  const onSuccessChangePassword = () => {
    formChangePassword.resetFields()
    toast.success('Cập nhật thành công.')
  }
  const { mutate: mutateUpdatePassword, isPending: isLoadingChangePassword } =
    useUpdatePassword(onSuccessChangePassword)

  const handleChangePassword = async () => {
    try {
      await formChangePassword.validateFields()
      const data = formChangePassword.getFieldsValue()
      delete data.confirm_password
      mutateUpdatePassword(data)
    } catch {
      /* empty */
    }
  }
  return (
    <>
      <div className='mb-4 flex justify-center text-2xl font-bold'>
        THAY ĐỔI MẬT KHẨU
      </div>
      <Form
        layout='vertical'
        className='mx-auto w-full md:w-[400px]'
        form={formChangePassword}
        name='form-change-password'
      >
        <Form.Item
          label='Mật khẩu hiện tại'
          name='old_password'
          rules={[
            {
              required: true,
              message: 'Không được để trống trường này',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='new_password'
          dependencies={['old_password']}
          label='Mật khẩu mới'
          rules={[
            {
              required: true,
              message: 'Không được để trống trường này',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='Xác nhận mật khẩu'
          dependencies={['new_password']}
          name='confirm_password'
          rules={[
            {
              required: true,
              message: 'Không được để trống trường này',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu đã nhập không khớp'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div className='flex justify-end'>
          <Button
            type='primary'
            loading={isLoadingChangePassword}
            onClick={handleChangePassword}
          >
            Xác nhận
          </Button>
        </div>
      </Form>
    </>
  )
}

export default UpdatePassword
