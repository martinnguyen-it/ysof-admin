import FormInput from '@components/FormInput'
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from '@domain/auth/schema'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

type Props = {
  onReset: (val: { email: string }) => void
}

const ForgotPasswordForm: React.FC<Props> = ({ onReset }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: yupResolver(ForgotPasswordSchema),
  })

  return (
    <>
      <form onSubmit={handleSubmit(onReset)} className='flex w-full flex-col'>
        <FormInput label='Email' error={errors.email?.message} placeholder='---@email.com' {...register('email')} />

        <button className='mt-6 w-full rounded-lg bg-[#38b2ca] px-5 py-3 text-sm font-semibold text-white md:mt-8 md:text-lg'>
          {isSubmitting ? 'Loading' : 'Gửi link đặt lại mật khẩu'}
        </button>
      </form>
      <div className='mt-[14px] text-sm md:mt-5 md:text-base'>
        <Link className='font-medium text-[#38b2ca]' to='/auth/login'>
          Trở lại đăng nhập
        </Link>
      </div>
    </>
  )
}

export default ForgotPasswordForm
