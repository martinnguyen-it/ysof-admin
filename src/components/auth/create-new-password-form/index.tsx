import FormInput from '@components/form-input'
import type { UserCreateNewPasswordPayload } from '@domain/user'
import { CreateNewPasswordSchema } from '@domain/user/schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'

type Props = {
    onSubmit: (val: UserCreateNewPasswordPayload) => void
    errorMessage: string | null
}

const CreateNewPasswordForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserCreateNewPasswordPayload>({
        resolver: yupResolver(CreateNewPasswordSchema),
    })

    return (
        <>
            {errorMessage && (
                <div
                    className="relative mb-8 w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-center text-red-700"
                    role="alert"
                >
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col"
            >
                <FormInput
                    className="mb-4 md:mb-6"
                    label="New Password"
                    error={errors.password?.message}
                    type="password"
                    placeholder="*********"
                    {...register('password')}
                />
                <FormInput
                    label="Confirm Password"
                    error={errors.passwordConfirm?.message}
                    type="password"
                    placeholder="*********"
                    {...register('passwordConfirm')}
                />
                <div className="mt-[10px] flex items-center justify-between text-xs md:mt-3 md:text-sm">
                    <div className="flex justify-center gap-[6px] text-cinder">
                        <input type="checkbox" id="checkbox" />{' '}
                        <label htmlFor="checkbox">Remember me</label>
                    </div>
                    <div className="text-[#15C8ED]">
                        <Link href="forgot-password">Forgot password</Link>
                    </div>
                </div>

                <button className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white md:mt-8 md:text-lg">
                    {isSubmitting ? 'Loading' : 'Reset password'}
                </button>
            </form>
        </>
    )
}

export default CreateNewPasswordForm
