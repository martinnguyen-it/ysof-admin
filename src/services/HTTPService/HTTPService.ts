import axios, { AxiosError, AxiosHeaders } from 'axios'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment'
import { toast } from 'react-toastify'
import { HTTPStatusCode } from './helpers'
import { accessTokenState } from '@atom/authAtom'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { API_CONFIG } from '@src/constants'
import qs from 'qs'

/**
 * add user token to request header
 *
 * @param {Options} options - url Endpoint
 * @param token
 * @returns {Options}
 */

interface JwtToken {
  exp?: string
}

const instance = axios.create({
  baseURL: API_CONFIG.HOST,
  timeout: Number(API_CONFIG.timeout),
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
})

instance.interceptors.request.use((request) => {
  const accessToken = getRecoil(accessTokenState)
  const newHeaders: AxiosHeaders = request.headers || {}
  newHeaders['Authorization'] = `Bearer ${accessToken}`
  request = {
    ...request,
    headers: newHeaders,
  }
  return request
})

export const handleClearAuthorization = (isManual?: boolean) => {
  if (!isManual) {
    toast.error('Phiên đăng nhập đã hết hạn.')
  }
  setRecoil(accessTokenState, '')
}

export const handleCheckTokenExpired = ({ accessToken, onLogout, onAuthenticated }: { accessToken: string | null; onLogout: () => void; onAuthenticated: () => void }) => {
  if (accessToken) {
    const now = moment().utc().format('X')
    const decodeAccessTokenExp = jwtDecode(accessToken) as JwtToken
    const accessTokenExp = decodeAccessTokenExp?.exp || ''
    if (accessTokenExp > now) {
      onAuthenticated()
    } else onLogout()
  } else onLogout()
}

instance.interceptors.response.use(
  (response) => {
    if (response?.data) return response.data
    return response
  },
  (error) => {
    try {
      const accessToken = getRecoil(accessTokenState)
      if (!isUnauthorizedError(error)) {
        const message = error?.response?.data?.detail || error?.response?.data?.message || error.message
        const customError = new AxiosError(message)
        customError.status = error?.response?.status
        return Promise.reject(customError)
      }
      if (!accessToken) {
        handleClearAuthorization()
      }
      if (accessToken && isUnauthorizedError(error)) {
        handleCheckTokenExpired({
          accessToken,
          onLogout: handleClearAuthorization,
          onAuthenticated() {
            return
          },
        })
      }
    } catch (interceptorError) {
      toast.error(`Error in interceptor: ${interceptorError}`)
      return Promise.reject(interceptorError)
    }
  },
)

const isUnauthorizedError = (error: any) => {
  const {
    response: { status },
  } = error
  return status === HTTPStatusCode.UNAUTHORIZED
}

const { delete: del, get, patch, post, put } = instance

/**
 * API Failure Response type guard
 *
 * @param {*} arg any
 * @returns {arg is Error}
 */
const isFailureResponse = (arg: Error): arg is Error => {
  return arg.message !== undefined
}

export { del, get, isFailureResponse, patch, post, put }
