import { createAxios } from '@/utils/api'
import {
  ProductListParams,
  ProductParams,
  ProductIdParams
} from './FEModel'

export const fetchProductList = (params: ProductListParams) => {
  return createAxios({
    apiUrl: 'products',
    method: 'GET',
    params,
    isAdmin: true
  })
}

export const fetchProduct = (restfulParam: ProductIdParams) => {
  return createAxios({
    apiUrl: 'product/{productId}',
    method: 'GET',
    restfulParam,
    isAdmin: true
  })
}

export const postProduct = (params: ProductParams) => {
  return createAxios({
    apiUrl: 'product',
    method: 'POST',
    params,
    isAdmin: true
  })
}

export const patchProduct = (restfulParam: ProductIdParams, params: ProductParams) => {
  return createAxios({
    apiUrl: 'product/{productId}',
    method: 'PATCH',
    restfulParam,
    params,
    isAdmin: true
  })
}

export const deleteProduct = (restfulParam: ProductIdParams) => {
  return createAxios({
    apiUrl: 'product/{productId}',
    method: 'DELETE',
    restfulParam,
    isAdmin: true
  })
}