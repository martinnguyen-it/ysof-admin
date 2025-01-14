import { accessTokenState, userInfoState } from '@atom/authAtom'
import { ILoginRequest, ILoginResponse } from '@domain/auth/type'
import { useLogin } from '@src/apis/auth/useLogin'
import FormContainer from '@src/components/auth/form-container'
import LoginForm from '@src/components/auth/login-form'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'

const LoginV = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState)

  const setInfoUser = useSetRecoilState(userInfoState)
  const navigate = useNavigate()
  const location = useLocation()

  const backURL = new URLSearchParams(location.search).get('back_url')

  const onSuccess = (data: ILoginResponse) => {
    setAccessToken(data.access_token)
    setInfoUser(data.user)
  }

  const { mutate } = useLogin(onSuccess)
  const onLogin = async (val: ILoginRequest) => {
    mutate(val)
  }
  useEffect(() => {
    if (accessToken != '') navigate(backURL || '/')
  }, [accessToken])

  return (
    <div className='h-screen bg-[#F9FEFF] px-4 pt-[85px] md:pt-[100px]'>
      <FormContainer title='BTC YSOF' des='Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn'>
        <LoginForm onLogin={onLogin} />
      </FormContainer>
    </div>
  )
}

export default LoginV
