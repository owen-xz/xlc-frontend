<template>
  <div class="page-content">
    <div class="filter">
      <div class="filter-title">依下方條件查詢</div>
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="訂單號碼">
              <el-input v-model="filterData.orderId" placeholder="請輸入訂單號碼" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建立日期">
              <el-date-picker
                v-model="filterData.createdAt"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="訂購人">
              <el-input v-model="filterData.orderer" placeholder="請輸入訂購人" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="訂單狀態">
              <el-select v-model="filterData.status" placeholder="請選訂單狀態">
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="付款類型">
              <el-select v-model="filterData.paymentType" placeholder="請選擇付款類型">
                <el-option
                  v-for="(item, index) in paymentTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="運送類型">
              <el-select v-model="filterData.transportType" placeholder="請選擇運送類型">
                <el-option
                  v-for="(item, index) in transportTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="filter-footer">
        <el-button type="primary" @click="search">查詢</el-button>
        <el-button @click="clear">清除</el-button>
      </div>
    </div>
    <div class="page-header">
      <div class="page-title">訂單列表</div>
    </div>
    <el-table
      :data="listData"
      stripe
      empty-text="目前尚無資料">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column prop="_id" label="訂單編號" width="220" />
      <el-table-column prop="orderer.ordererName" label="訂購人" min-width="80" />
      <el-table-column label="訂單狀態" width="80">
        <template #default="scope">
          <span>{{ filterStatusName(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款類型" width="80">
        <template #default="scope">
          <span>{{ filterPaymentTypeName(scope.row.paymentType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="運送類型" width="80">
        <template #default="scope">
          <span>{{ filterTransportTypeName(scope.row.transportType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建立時間" width="150">
        <template #default="scope">
          <span>{{ dayjs(scope.row.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button
            size="small"
            @click.prevent="router.push({name: 'AdminOrderDetail', params: { id: scope.row._id}})">
            檢視
          </el-button>
          <el-button
            size="small"
            :disabled="scope.row.status === 6"
            @click.prevent="handleCancelOrder(scope.row._id)">
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageParams.maxCount"
        :total="pageParams.total"
        :current-page="pageParams.currentPage"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'
import { pageLoading, getPageList } from '@/utils/mixins'
import { fetchOrderList, cancelOrder } from '@/utils/api/back/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const dayjs = inject('$dayjs') as any

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

const pageParams = reactive({
  maxCount: 10,
  currentPage: 1,
  total: 0
})
const filterData = ref({
  orderId: '',
  orderer: '',
  status: null,
  paymentType: null,
  transportType: null,
  createdAt: [] as Date[]
})
const searchParams = computed(() => {
  const { currentPage, maxCount } = pageParams
  const offset = (currentPage - 1) * maxCount
  return {
    offset,
    maxCount,
    ...filterData.value
  }
})

const listData = ref([])
const getList =  async () => {
  pageLoading(true)
  const { res, err } = await fetchOrderList(searchParams.value)
  if(res) {
    pageLoading(false)
    listData.value = res.data.orders
    pageParams.total = res.data.total
  }
  if(err) {
    pageLoading(false)
    console.log(err);
  }
}

// 換頁
const currentChange = (e: number) => {
  pageParams.currentPage = e
  getList()
}

// 搜尋
const search = () => {
  currentChange(1)
}

// 清除
const clear = () => {
  filterData.value = {
    orderId: '',
    orderer: '',
    status: null,
    paymentType: null,
    transportType: null,
    createdAt: []
  }
  currentChange(1)
}

// 取消訂單
const handleCancelOrder = async (orderId: string) => {
  ElMessageBox.confirm(
    '確定要取消此訂單嗎？',
    '警告',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(async () => {
    pageLoading(true)
    const restfulParam = {
      orderId
    }
    const { res, err } = await cancelOrder(restfulParam)
    if(res) {
      await getList()
      pageLoading(false)
      ElMessage({
        message: '取消訂單成功',
        type: 'success'
      })
    }
    if(err) {
      pageLoading(false)
      ElMessage({
        message: '取消訂單失敗',
        type: 'error'
      })
    }
  })
}

onMounted(() => {
  getPageList('order')
  getList()
})
</script>

<style scoped lang="scss">
.page-title {
  @include font-h2;
}
.page-footer {
  margin-top: 20px;
}
</style>
