<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">商品列表</h2>
      <button class="btn btn-primary" @click="goEdit(null)">新增商品</button>
    </div>
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th style="min-width: 200px" scope="col text-nowrap">商品名稱</th>
            <th style="min-width: 80px" scope="col">類型</th>
            <th style="min-width: 120px" scope="col">品項</th>
            <th class="text-end text-nowrap" scope="col">原始價格</th>
            <th class="text-end text-nowrap" scope="col">折扣價格</th>
            <th class="text-end text-nowrap" scope="col">剩餘數量</th>
            <th style="min-width: 60px" scope="col">狀態</th>
            <th style="min-width: 150px" class="text-nowrap" scope="col">操作</th>
          </tr>
        </thead>
        <tbody v-if="listData.length">
          <tr v-for="(item, index) in listData" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>
              <select
                class="form-select"
                :name="`item${index}option`"
                :id="`item${index}option`"
                v-model="selectedOptionsIndex[index]"
                v-if="item.options.length > 1">
                <option
                  v-for="(option, optionIndex) in item.options"
                  :key="optionIndex"
                  :value="optionIndex">
                  {{ option.name }}
                </option>
              </select>
              <span v-else>{{ item.options[selectedOptionsIndex[index]].name }}</span>
            </td>
            <td class="text-end">
              ${{ item.options[selectedOptionsIndex[index]].price }}
            </td>
            <td class="text-end">
              ${{ item.options[selectedOptionsIndex[index]].discountPrice }}
            </td>
            <td class="text-end">
              {{ item.options[selectedOptionsIndex[index]].count }}
            </td>
            <td>{{ item.status ? '上架' : '下架' }}</td>
            <td>
              <button class="btn btn-link" @click.prevent="goEdit(item._id)">編輯</button>
              <button class="btn btn-link" @click.prevent="deleteProduct(item._id)">刪除</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="text-center" :colspan="9">目前尚無資料</td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <a
            class="page-link"
            :class="{'disabled': pageParams.currentPage === 1}"
            @click.prevent="pageParams.currentPage --; getList()"
            href="#"
            aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="(item, index) in pageParams.totalPage"
          :key="index">
          <a 
            class="page-link"
            :class="{'disabled': pageParams.currentPage === item}"
            href="#"
            @click.prevent="pageParams.currentPage = item; getList()">
            {{ item }}
          </a>
        </li>
        <li class="page-item">
          <a
            class="page-link"
            :class="{'disabled': pageParams.currentPage === pageParams.totalPage}"
            @click.prevent="pageParams.currentPage ++; getList()"
            href="#"
            aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authorization, showAlert, showConfirm, pageLoading } from '@/utils/mixins'

const axios: any = inject('axios')
const router = useRouter()

const pageParams = reactive({
  offset: 0,
  maxCount: 10,
  currentPage: 1,
  totalPage: 1,
  total: 0
})
const searchParams = computed(() => {
  const { currentPage, totalPage, total, ...pageQueries } = pageParams
  pageQueries.offset = (currentPage - 1) * pageQueries.maxCount
  return {
    ...pageQueries
  }
})
const listData = ref([])
const selectedOptionsIndex = ref([] as number[])
const getList =  async() => {
  pageLoading(true)
  const url = `${process.env.VUE_APP_XLC_API}products`
  try {
    const res = await axios.get(url, {
      params: searchParams.value,
      ...authorization()
    })
    listData.value = res.data.data.products
    pageParams.total = res.data.data.total
    pageParams.totalPage = Math.ceil(pageParams.total / pageParams.maxCount)
    for(let i = 0; i < pageParams.total; i ++) {
      selectedOptionsIndex.value.push(0)
    }
    pageLoading(false)
  } catch (err: any) {
    pageLoading(false)
    showAlert('danger', '取得資料失敗')
  }
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

const deleteProduct = async (id: string) => {
  showConfirm({
    status: 'danger',
    title: '警告',
    content: '確定要刪除此商品嗎？',
    confirmBtn: '刪除',
    callback: async () => {
      pageLoading(true)
      const url = `${process.env.VUE_APP_XLC_API}product/${id}`
      try {
        const res = await axios.delete(url, {
          ...authorization()
        })
        await getList()
        pageLoading(false)
        showAlert('success', '刪除資料成功')
      } catch (err: any) {
        pageLoading(false)
        showAlert('danger', '刪除資料失敗')
      }
    }
  })
}

onMounted(() => {
  getList()
})
 
</script>

<style scoped lang="scss">
</style>
