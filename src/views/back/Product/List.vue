<template>
  <div class="page-content">
    <div class="filter">
      <div class="filter-title">依下方條件查詢</div>
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="商品名稱">
              <el-input v-model="filterData.keyword" placeholder="請輸入商品名稱" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品類型">
              <el-select v-model="filterData.type" placeholder="請選擇商品類型">
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.name"
                  :value="item._id" />
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
      <div class="page-title">商品列表</div>
      <el-button type="primary" @click="goEdit(null)">新增商品</el-button>
    </div>
    <el-table
      :data="listData"
      stripe
      empty-text="目前尚無資料">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column prop="name" label="商品名稱" min-width="200" />
      <el-table-column prop="type" label="類型" width="80">
        <template #default="scope">
          <span>{{ scope.row.type.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品項" width="120">
        <template #default="scope">
          <el-select
            :name="`item${scope.$index}option`"
            :id="`item${scope.$index}option`"
            v-model="selectedOptionsIndex[scope.$index]"
            v-if="scope.row.options.length > 1">
            <el-option
              v-for="(option, optionIndex) in scope.row.options"
              :key="optionIndex"
              :label="option.name"
              :value="optionIndex" />
          </el-select>
          <span v-else>{{ scope.row.options[0].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原始價格" align="right">
        <template #default="scope">
          ${{ scope.row.options[selectedOptionsIndex[scope.$index]].price }}
        </template>
      </el-table-column>
      <el-table-column label="折扣價格" align="right">
        <template #default="scope">
          ${{ scope.row.options[selectedOptionsIndex[scope.$index]].discountPrice }}
        </template>
      </el-table-column>
      <el-table-column label="剩餘數量" align="right">
        <template #default="scope">
          {{ scope.row.options[selectedOptionsIndex[scope.$index]].count }}
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="60">
        <template #default="scope">
          {{ scope.row.status ? '上架' : '下架' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" @click.prevent="goEdit(scope.row._id)">編輯</el-button>
          <el-button size="small" @click.prevent="handleDeleteProduct(scope.row._id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageParams.maxCount"
        :total="pageParams.total"
        :current-page="pageParams.current"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageLoading, getTypeList } from '@/utils/mixins'
import { fetchProductList, deleteProduct } from '@/utils/api/back/product'
import store from '@/store'

const router = useRouter()

const typeList = computed(() => store.state.typeList)
const pageParams = reactive({
  maxCount: 10,
  currentPage: 1,
  totalPage: 1,
  total: 0
})
const filterData = ref({
  keyword: '',
  type: ''
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
const selectedOptionsIndex = ref([] as number[])
const getList =  async () => {
  pageLoading(true)
  const { res, err } = await fetchProductList(searchParams.value)
  if(res) {
    pageLoading(false)
    listData.value = res.data.products
    pageParams.total = res.data.total
    pageParams.totalPage = Math.ceil(pageParams.total / pageParams.maxCount)
    for(let i = 0; i < pageParams.total; i ++) {
      selectedOptionsIndex.value.push(0)
    }
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
    keyword: '',
    type: ''
  }
  currentChange(1)
}

const goEdit = (id: string | null) => {
  if(id !== null) {
    router.push({
      name: 'AdminProductEdit',
      params: {
        id
      }
    })
  } else {
    router.push({name: 'AdminProductEdit'})
  }
}

const handleDeleteProduct = async (id: string) => {
  ElMessageBox.confirm(
    '確定要刪除此商品嗎？',
    '警告',
    {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async () => {
    pageLoading(true)
    const restfulParam = {
      productId: id
    }
    const { res, err } = await deleteProduct(restfulParam)
    if(res) {
      await getList()
      pageLoading(false)
      ElMessage({
        message: '刪除資料成功',
        type: 'success'
      })
    }
    if(err) {
      pageLoading(false)
      ElMessage({
        message: '刪除資料失敗',
        type: 'error'
      })
    }
  })
}

onMounted(() => {
  getTypeList()
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
