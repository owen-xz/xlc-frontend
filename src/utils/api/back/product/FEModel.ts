export interface ProductListParams {
  offset: number
  maxCount: number
  keyword: string
  type: string
}

export interface Option {
  name: string
  price: null | number
  discountPrice: null | number
  count: null | number
}

export interface ProductParams {
  name: string
  type: string
  options: Array<Option>
  description: string
  status: boolean
}

export interface ProductIdParams {
  productId: string
}