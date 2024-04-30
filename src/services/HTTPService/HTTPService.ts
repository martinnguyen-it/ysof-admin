import axios, { AxiosHeaders } from 'axios'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment'
import { toast } from 'react-toastify'
import { serviceErrorHandler } from './error'
import { HTTPStatusCode, UnauthorizedEvent } from './helpers'
import { HTTPRequest, RequestParams } from './types'
import { accessTokenState } from '@atom/authAtom'
import { getRecoil, setRecoil } from 'recoil-nexus'
import { API_CONFIG } from '@src/constants'

export interface HTTPService {
  post: HTTPRequest
  get: HTTPRequest
  del: HTTPRequest
  put: HTTPRequest
  patch: HTTPRequest
  authGet: HTTPRequest
  authPost: HTTPRequest
  authDel: HTTPRequest
  authPut: HTTPRequest
  authPatch: HTTPRequest
  isFailureResponse: (arg: Error) => arg is Error
  unauthorizedEvent: UnauthorizedEvent
}

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
  (response) => response,
  async (error) => {
    try {
      const accessToken = getRecoil(accessTokenState)
      if (!isUnauthorizedError(error)) {
        return Promise.reject(error)
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

function isUnauthorizedError(error: any) {
  const {
    response: { status },
  } = error
  return status === HTTPStatusCode.UNAUTHORIZED
}

const post: HTTPRequest = serviceErrorHandler(async ({ url, data, options }: RequestParams) => {
  const res = await instance.post(url, data, options)
  return res
})

const get: HTTPRequest = serviceErrorHandler(async ({ url, data, options }: RequestParams) => {
  let reqOptions = options
  if (data) {
    reqOptions = {
      ...options,

      params: data,
    }
  }

  const res = await instance.get(url, reqOptions)
  return res
})

const del: HTTPRequest = serviceErrorHandler(async ({ url, options }: RequestParams) => {
  const res = await instance.delete(url, options)

  return res
})

const put: HTTPRequest = serviceErrorHandler(async ({ url, data, options }: RequestParams) => {
  const res = await instance.put(url, data, options)

  return res
})
const patch: HTTPRequest = serviceErrorHandler(async ({ url, data, options }) => {
  const res = await instance.patch(url, data, options)

  return res
})

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
