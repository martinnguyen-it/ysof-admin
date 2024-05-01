import FormInput from '@components/FormInput'
import { CreateNewPasswordSchema, CreateNewPasswordSchemaType } from '@domain/auth/schema'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  onSubmit: (val: CreateNewPasswordSchemaType) => void
}

const CreateNewPasswordForm: React.FC<Props> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateNewPasswordSchemaType>({
    resolver: yupResolver(CreateNewPasswordSchema),
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col'>
        <FormInput className='mb-4 md:mb-6' label='Mật khẩu mới' error={errors.password?.message} type='password' placeholder='*********' {...register('password')} />
        <FormInput label='Xác nhận mật khẩu' error={errors.passwordConfirm?.message} type='password' placeholder='*********' {...register('passwordConfirm')} />
        <button className='mt-6 w-full rounded-lg bg-[#38b2ca] px-5 py-3 text-sm font-semibold text-white md:mt-8 md:text-lg'>
          {isSubmitting ? 'Loading' : 'Đặt lại mật khẩu'}
        </button>
      </form>
    </>
  )
}

export default CreateNewPasswordForm
