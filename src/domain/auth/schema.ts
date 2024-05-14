import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
  email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ'),
  password: yup.string().required('Vui lòng nhập mật khẩu').min(8, 'Mật khẩu phải tối thiểu 8 ký tự'),
})
export type LoginSchemaType = yup.InferType<typeof LoginSchema>

export const ForgotPasswordSchema = yup
  .object()
  .shape({
    email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ'),
  })
  .required()

export type ForgotPasswordSchemaType = yup.InferType<typeof ForgotPasswordSchema>

export const CreateNewPasswordSchema = yup
  .object()
  .shape({
    password: yup.string().required('Vui lòng nhập mật khẩu').min(8, 'Mật khẩu phải tối thiểu 8 ký tự'),
    passwordConfirm: yup
      .string()
      .required('Vui lòng nhập mật khẩu')
      .min(8, 'Mật khẩu phải tối thiểu 8 ký tự')
      .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  })
  .required()

export type CreateNewPasswordSchemaType = yup.InferType<typeof CreateNewPasswordSchema>
