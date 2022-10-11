import { createAxios } from '@/utils/api'
import {
  CouponListParams,
  CouponParams,
  CouponIdParams
} from './FEModel'

const couponListParamsBff = (params: CouponListParams) => {
  const { effectiveAt, ...others  } = params
  return {
    ...others,
    startAt: effectiveAt && effectiveAt[0] ? effectiveAt[0] : undefined,
    dueAt: effectiveAt && effectiveAt[1] ? new Date(effectiveAt[1].setDate(effectiveAt[1].getDate() + 1)) : undefined
  }
}

const couponParamsBff = (params: CouponParams) => {
  const { effectiveAt, ...others  } = params
  return {
    ...others,
    startAt: effectiveAt ? effectiveAt[0] : undefined,
    dueAt: effectiveAt ? effectiveAt[1] : undefined
  }
}

export const fetchCouponList = (params: CouponListParams) => {
  return createAxios({
    apiUrl: 'coupons',
    method: 'GET',
    params: couponListParamsBff(params),
    isAdmin: true
  })
}

export const postCoupon = (params: CouponParams) => {
  return createAxios({
    apiUrl: 'coupon',
    method: 'POST',
    params: couponParamsBff(params),
    isAdmin: true
  })
}

export const patchCoupon = (restfulParam: CouponIdParams, params: CouponParams) => {
  return createAxios({
    apiUrl: 'coupon/{couponId}',
    method: 'PATCH',
    restfulParam,
    params: couponParamsBff(params),
    isAdmin: true
  })
}

export const deleteCoupon = (restfulParam: CouponIdParams) => {
  return createAxios({
    apiUrl: 'coupon/{couponId}',
    method: 'DELETE',
    restfulParam,
    isAdmin: true
  })
}