import FormInput from '@components/form-input'
import { ForgotPasswordSchema } from '@domain/user/schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'

type Props = {
    onReset: (val: { email: string }) => void
    errorMessage: string | null
}

const ForgotPasswordForm: React.FC<Props> = ({ onReset, errorMessage }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<{ email: string }>({
        resolver: yupResolver(ForgotPasswordSchema),
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
                onSubmit={handleSubmit(onReset)}
                className="flex w-full flex-col"
            >
                <FormInput
                    label="Email"
                    error={errors.email?.message}
                    placeholder="---@email.com"
                    {...register('email')}
                />

                <button className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white md:mt-8 md:text-lg">
                    {isSubmitting ? 'Loading' : 'Send Reset password Link'}
                </button>
            </form>
            <div className="mt-[14px] text-sm md:mt-5 md:text-base">
                <Link className="font-medium text-primary" href="/auth/login">
                    Back to login
                </Link>
            </div>
        </>
    )
}

export default ForgotPasswordForm
