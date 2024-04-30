import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(8, 'Password has at least 8 characters'),
})
export type LoginSchemaType = yup.InferType<typeof LoginSchema>

export const ForgotPasswordSchema = yup
  .object()
  .shape({
    email: yup.string().required('Email is required').email('Invalid email'),
  })
  .required()

export type ForgotPasswordSchemaType = yup.InferType<typeof ForgotPasswordSchema>

export const CreateNewPasswordSchema = yup
  .object()
  .shape({
    password: yup.string().required('Password is required').min(8, 'Password has at least 8 characters'),
    passwordConfirm: yup
      .string()
      .required('Password is required')
      .min(8, 'Password has at least 8 characters')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })
  .required()

export type CreateNewPasswordSchemaType = yup.InferType<typeof CreateNewPasswordSchema>
