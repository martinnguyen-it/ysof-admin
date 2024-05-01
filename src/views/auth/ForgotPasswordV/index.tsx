import ForgotPasswordForm from '@components/auth/forgot-password-form'
import FormContainer from '@src/components/auth/form-container'
import { toast } from 'react-toastify'

const ForgotPasswordV = () => {
  const onReset = async ({ email }: { email: string }) => {
    console.log('🚀 ~ onReset ~ email:', email)
    toast.warning('This feature is not currently available.')
  }

  return (
    <div className='h-screen bg-[#F9FEFF] px-4 pt-[85px] md:pt-[100px]'>
      <FormContainer title='Quên mật khẩu' des='Vui lòng nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu của bạn.'>
        <ForgotPasswordForm onReset={onReset} />
      </FormContainer>
    </div>
  )
}

export default ForgotPasswordV
