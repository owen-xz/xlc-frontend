import { createAxios } from '@/utils/api'
import {
  TypeParams,
  TypeIdParams
} from './FEModel'

export const fetchTypeList = () => {
  return createAxios({
    apiUrl: 'types',
    method: 'GET'
  })
}

export const postType = (params: TypeParams) => {
  return createAxios({
    apiUrl: 'type',
    method: 'POST',
    params,
    isAdmin: true
  })
}

export const patchType = (restfulParam: TypeIdParams, params: TypeParams) => {
  return createAxios({
    apiUrl: 'type/{typeId}',
    method: 'PATCH',
    restfulParam,
    params,
    isAdmin: true
  })
}

export const deleteType = (restfulParam: TypeIdParams) => {
  return createAxios({
    apiUrl: 'type/{typeId}',
    method: 'DELETE',
    restfulParam,
    isAdmin: true
  })
}
