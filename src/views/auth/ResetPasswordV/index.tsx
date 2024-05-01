import CreateNewPasswordForm from '@components/auth/create-new-password-form'
import { CreateNewPasswordSchemaType } from '@domain/auth/schema'
import FormContainer from '@src/components/auth/form-container'
import { toast } from 'react-toastify'

const ResetPasswordV = () => {
  const onSubmit = async (val: CreateNewPasswordSchemaType) => {
    console.log('🚀 ~ onSubmit ~ email:', val)
    toast.warning('This feature is not currently available.')
  }

  return (
    <div className='h-screen bg-[#F9FEFF] px-4 pt-[85px] md:pt-[100px]'>
      <FormContainer title='Đặt lại mật khẩu' des='Nhập mật khẩu mới bên dưới để thay đổi mật khẩu của bạn.'>
        <CreateNewPasswordForm onSubmit={onSubmit} />
      </FormContainer>
    </div>
  )
}

export default ResetPasswordV
