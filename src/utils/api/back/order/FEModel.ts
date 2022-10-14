export interface OrderListParams {
  offset: number
  maxCount: number
  orderId: string
  orderer: string
  status: number | null
  paymentType: number | null
  transportType: number | null
  createdAt: Date[]
}

export interface OrderIdParams {
  orderId: string
}
