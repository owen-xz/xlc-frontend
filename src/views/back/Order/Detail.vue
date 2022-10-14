<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">訂單詳情</h2>
    </div>
    <el-form :model="submitForm" label-width="100px">
      <el-form-item label="訂單編號">
        <span>{{ submitForm.orderId }}</span>
      </el-form-item>
      <el-form-item label="建立日期">
        <span>{{ submitForm.createdAt ? dayjs(submitForm.createdAt).format('YYYY-MM-DD HH:mm') : '' }}</span>
      </el-form-item>
      <el-form-item label="訂購人">
        <span>{{ submitForm.orderer.ordererName }}</span>
      </el-form-item>
      <el-form-item label="訂單狀態">
        <span>{{ filterStatusName(submitForm.status) }}</span>
      </el-form-item>
      <el-form-item label="付款類型">
        <span>{{ filterPaymentTypeName(submitForm.paymentType) }}</span>
      </el-form-item>
      <el-form-item label="運送類型">
        <span>{{ filterTransportTypeName(submitForm.transportType) }}</span>
      </el-form-item>
      <el-form-item label="收件人姓名">
        <span>{{ submitForm.receiver.name }}</span>
      </el-form-item>
      <el-form-item label="聯絡電話">
        <span>{{ submitForm.receiver.phone }}</span>
      </el-form-item>
      <el-form-item label="Email">
        <span>{{ submitForm.receiver.email }}</span>
      </el-form-item>
      <el-form-item label="收件地址">
        <span>{{ submitForm.receiver.address }}</span>
      </el-form-item>
      <el-form-item label="備註">
        <span>{{ submitForm.note || '無' }}</span>
      </el-form-item>
      <el-form-item label="訂購商品">
        <el-table :data="submitForm.products" stripe empty-text="目前尚無資料">
          <el-table-column prop="productName" label="商品名稱" />
          <el-table-column prop="optionName" label="品項名稱" />
          <el-table-column label="價格" align="right" width="80">
            <template #default="scope">
              <span>${{ scope.row.discountPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="數量" align="right" width="80" />
          <el-table-column label="合計" align="right" width="80">
            <template #default="scope">
              <span>${{ scope.row.discountPrice * scope.row.count }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="totalForm-wrap">
          <el-form class="totalForm" label-width="100px">
            <el-form-item label="總計" v-if="submitForm.totalPrice">
              <div class="price">${{ submitForm.totalPrice }}</div>
            </el-form-item>
            <el-form-item label="套用優惠券" v-if="submitForm.coupon">
              <div class="price">-${{ submitForm.totalPrice - submitForm.finalPrice }}</div>
            </el-form-item>
            <el-form-item label="訂單金額" v-if="submitForm.finalPrice">
              <div class="price">${{ submitForm.finalPrice }}</div>
            </el-form-item>
          </el-form>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'
import { pageLoading, getPageList } from '@/utils/mixins'
import { ElMessage } from 'element-plus'
import { fetchOrder } from '@/utils/api/back/order'

const route = useRoute()
const router = useRouter()
const dayjs = inject('$dayjs') as any

const pageParams = reactive({
  id: route.params.id || null
})

// 取得類型
const statusList = computed(() => {
  const pageList = store.state.pageList
  if(pageList.order) {
    return pageList.order.status
  }
  return []
})
const filterStatusName = (status: number) => {
  const statusData = statusList.value.find(item => item.id === status)
  return statusData ? statusData.name : ''
}
const paymentTypeList = computed(() => {
  const pageList = store.state.pageList
  if(pageList.order) {
    return pageList.order.paymentType
  }
  return []
})
const filterPaymentTypeName = (paymentType: number) => {
  const paymentTypeData = paymentTypeList.value.find(item => item.id === paymentType)
  return paymentTypeData ? paymentTypeData.name : ''
}
const transportTypeList = computed(() => {
  const pageList = store.state.pageList
  if(pageList.order) {
    return pageList.order.transportType
  }
  return []
})
const filterTransportTypeName = (transportType: number) => {
  const transportTypeData = transportTypeList.value.find(item => item.id === transportType)
  return transportTypeData ? transportTypeData.name : ''
}

const submitForm = ref({
  orderId: '',
  products: [],
  orderer: {
    ordererId: '',
    ordererName: ''
  },
  receiver: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  status: null,
  paymentType: null,
  transportType: null,
  totalPrice: null,
  finalPrice: null,
  coupon: null,
  note: '',
  createdAt: ''
})

const getData =  async () => {
  pageLoading(true)
  const restfulParam = {
    orderId: pageParams.id as string
  }
  const { res, err } = await fetchOrder(restfulParam)
  if(res) {
    pageLoading(false)
    const { _id, ...others } = res.data
    console.log(res.data);
    
    submitForm.value = {
      orderId: _id,
      ...others
    }
  }
  if(err) {
    pageLoading(false)
    ElMessage({
      message: '取得資料失敗',
      type: 'error'
    })
  }
}

onMounted(async () => {
  getPageList('order')
  getData()
})
 
</script>

<style scoped lang="scss">
.totalForm-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-right: 12px;
  margin-top: 10px;
  .totalForm {
    width: 150px;
    .price {
      width: 100%;
      text-align: right;
    }
  }
}
</style>
