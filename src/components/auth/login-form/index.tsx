import { LoginSchema, LoginSchemaType } from '@domain/auth/schema'
import { ILoginRequest } from '@domain/auth/type'
import { yupResolver } from '@hookform/resolvers/yup'
import FormInput from '@src/components/FormInput'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

type Props = {
  onLogin: (val: ILoginRequest) => void
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(LoginSchema),
  })

  return (
    <>
      <form onSubmit={handleSubmit(onLogin)} className='flex w-full flex-col'>
        <FormInput className='text-cinder mb-4 md:mb-6' label='Email' error={errors.email?.message} placeholder='---@email.com' {...register('email')} />
        <FormInput label='Mật khẩu' error={errors.password?.message} type='password' placeholder='*********' {...register('password')} />
        <div className='mt-[10px] flex items-center justify-between text-xs md:mt-3 md:text-sm'>
          <div className='text-[#38b2ca]'>
            <Link to='/auth/forgot-password'>Quên mật khẩu</Link>
          </div>
        </div>

        <button className='mt-6 w-full rounded-lg bg-[#38b2ca] px-5 py-3 text-sm font-semibold text-white md:mt-8 md:text-lg'>{isSubmitting ? 'Loading' : 'Đăng nhập'}</button>
      </form>
    </>
  )
}

export default LoginForm
