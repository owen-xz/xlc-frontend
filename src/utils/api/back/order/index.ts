import { createAxios } from '@/utils/api'
import {
  OrderListParams,
  OrderIdParams
} from './FEModel'

const orderListParamsBff = (params: OrderListParams) => {
  const { createdAt, ...queries } = params
  return {

  }
}

export const fetchOrderList = (params: OrderListParams) => {
  return createAxios({
    apiUrl: 'orders',
    method: 'GET',
    params,
    isAdmin: true
  })
}

export const fetchOrder = (restfulParam: OrderIdParams) => {
  return createAxios({
    apiUrl: 'order/{orderId}',
    method: 'GET',
    restfulParam,
    isAdmin: true
  })
}

export const cancelOrder = (restfulParam: OrderIdParams) => {
  return createAxios({
    apiUrl: 'order/{orderId}/cancel',
    method: 'POST',
    restfulParam,
    isAdmin: true
  })
}
