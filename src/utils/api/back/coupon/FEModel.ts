export interface CouponListParams {
  couponSn: string
  enable: boolean[]
  effectiveAt: Date[]
}

export interface CouponParams {
  couponSn: string
  discount: number
  enable: boolean
  effectiveAt: Date[]
  description: string
}

export interface CouponIdParams {
  couponId: string
}