import { createAxios } from '@/utils/api'
import {
  LoginParams,
  SignUpParams
} from './FEModel'

export const login = (params: LoginParams) => {
  return createAxios({
    apiUrl: 'users/sign_in',
    method: 'POST',
    params
  })
}

export const fetchUserProfile = () => {
  return createAxios({
    apiUrl: 'users/profile',
    method: 'GET',
    isAdmin: true
  })
}

export const signUp = (params: SignUpParams) => {
  return createAxios({
    apiUrl: 'users/sign_up',
    method: 'POST',
    params
  })
}

