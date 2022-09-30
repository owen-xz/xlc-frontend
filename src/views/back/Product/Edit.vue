<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">{{ pageParams.id ? '編輯' : '新增' }}商品</h2>
    </div>
    <el-form
      ref="submitFormRef"
      :model="submitForm"
      :rules="submitFormRules"
      label-width="80px">
      <el-form-item label="商品名稱" prop="name">
        <el-input v-model="submitForm.name" placeholder="請輸入商品名稱" />
      </el-form-item>
      <el-form-item label="商品類型" prop="type">
        <el-select v-model="submitForm.type" placeholder="請選擇商品類型">
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.name"
            :value="item._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品品項" prop="options">
        <div class="option-button-wrap">
          <el-button type="primary" @click="showOptionDialog(null)">
            新增品項
          </el-button>
        </div>
        <el-table :data="submitForm.options" stripe empty-text="目前尚無資料">
          <el-table-column prop="name" label="品項名稱" min-width="200" />
          <el-table-column prop="price" label="原始價格" align="right">
            <template #default="scope">
              <span>${{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discountPrice" label="折扣價格" align="right">
            <template #default="scope">
              <span>${{ scope.row.discountPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="數量" align="right" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button size="small" @click.prevent="showOptionDialog(scope.$index)">
                編輯
              </el-button>
              <el-button size="small" @click.prevent="deleteOption(scope.$index)">
                刪除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-checkbox v-model="submitForm.status" />
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="submitForm.description" />
      </el-form-item>
      <div class="form-bottom-wrap">
        <el-button @click="router.push({name: 'AdminProductList'})">取消</el-button>
        <el-button type="primary" @click="sendData">儲存</el-button>
      </div>
    </el-form>
    <el-dialog
      v-model="optionDialogVisible"
      :title="`${optionDialogType}品項`"
      width="50%">
      <el-form
        ref="optionFormRef"
        :model="tempOption"
        :rules="tempOptionRules"
        label-width="80px">
        <el-form-item label="品項名稱" prop="name">
          <el-input v-model="tempOption.name" placeholder="請輸入品項名稱" />
        </el-form-item>
        <el-form-item label="原始價格" prop="price">
          <el-input type="number" v-model.number="tempOption.price" placeholder="請輸入原始價格" />
        </el-form-item>
        <el-form-item label="折扣價格" prop="discountPrice">
          <el-input type="number" v-model.number="tempOption.discountPrice" placeholder="請輸入折扣價格" />
        </el-form-item>
        <el-form-item label="數量" prop="count">
          <el-input type="number" v-model.number="tempOption.count" placeholder="請輸入數量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hideOptionDialog">取消</el-button>
          <el-button type="primary" @click="editOption">確認</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pageLoading, getTypeList } from '@/utils/mixins'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import store from '@/store'

import {
  fetchProduct,
  postProduct,
  patchProduct
} from '@/utils/api/back/product'
import { Option } from '@/utils/api/back/product/FEModel'

const route = useRoute()
const router = useRouter()

const pageParams = reactive({
  id: route.params.id || null
})

// 取得類型
const typeList = computed(() => store.state.typeList)

const submitFormRef = ref<FormInstance>()
const submitForm = ref({
  name: '',
  type: '',
  options: [] as Array<Option>,
  description: '',
  status: true
})
const submitFormRules = reactive<FormRules>({
  name: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  type: [{ required: true, message: '請選擇商品類型', trigger: 'change' }],
  options: [{ required: true, message: '請新增商品品項', trigger: 'blur' }]
})

const getData =  async () => {
  pageLoading(true)
  const restfulParam = {
    productId: pageParams.id as string
  }
  const { res, err } = await fetchProduct(restfulParam)
  if(res) {
    pageLoading(false)
    const { name, type, options, description, status } = res.data
    submitForm.value = {
      name,
      type,
      options,
      description,
      status
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

// 品項彈窗
const optionDialogVisible = ref(false)
const optionDialogType = ref('')
let tempOptionIndex = null as number | null
const optionFormRef = ref<FormInstance>()
const tempOption = ref({
  name: '',
  price: null as number | null,
  discountPrice: null as number | null,
  count: null as number | null
})
const validatePrice = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請輸入原始價格'))
  } else if (value < 0) {
    callback(new Error('原始價格不可小於 0'))
  } else {
    callback()
  }
}
const validateDiscountPrice = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請輸入折扣價格'))
  } else if (value < 0) {
    callback(new Error('折扣價格不可小於 0'))
  } else {
    callback()
  }
}
const validateCount = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請輸入數量'))
  } else if (value < 0) {
    callback(new Error('數量不可小於 0'))
  } else {
    callback()
  }
}
const tempOptionRules = reactive<FormRules>({
  name: [{ required: true, message: '請輸入品項名稱', trigger: 'blur' }],
  price: [{ validator: validatePrice, required: true, trigger: 'blur' }],
  discountPrice: [{ validator: validateDiscountPrice, required: true, trigger: 'blur' }],
  count: [{ validator: validateCount, required: true, trigger: 'blur' }]
})

const showOptionDialog = (index: number | null = null) => {
  tempOptionIndex = index
  if(tempOptionIndex !== null) {
    optionDialogType.value = '編輯'
    tempOption.value = { ...submitForm.value.options[tempOptionIndex] }
  } else {
    optionDialogType.value = '新增'
    tempOption.value = {
      name: '',
      price: null,
      discountPrice: null,
      count: null
    }
  }
  optionDialogVisible.value = true
}
const hideOptionDialog = async () => {
  optionDialogVisible.value = false
  await optionFormRef.value?.clearValidate()
}

const editOption = async () => {
  await optionFormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      if(tempOptionIndex !== null) {
        submitForm.value.options[tempOptionIndex] = { ...tempOption.value }
      } else {
        submitForm.value.options.push(tempOption.value)
      }
      optionDialogVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
const deleteOption = (index: number) => {
  submitForm.value.options.splice(index, 1)
}

// 送出表單
const sendData = async () => {
  await submitFormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      pageLoading(true)
      const params = submitForm.value
      if(pageParams.id) {
        const restfulParam = {
          productId: pageParams.id as string
        }
        const { res, err } = await patchProduct(restfulParam, params)
        if(res) {
          pageLoading(false)
          ElMessage({
            message: '送出資料成功',
            type: 'success'
            })
          router.push({name: 'AdminProductList'})
        }
        if(err) {
          pageLoading(false)
          ElMessage({
            message: '送出資料失敗',
            type: 'error'
          })
        }
      } else {
        const { res, err } = await postProduct(params)
        if(res) {
          pageLoading(false)
          ElMessage({
            message: '送出資料成功',
            type: 'success'
          })
          router.push({name: 'AdminProductList'})
        }
        if(err) {
          pageLoading(false)
          ElMessage({
            message: '送出資料失敗',
            type: 'error'
          })
        }
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(async () => {
  getTypeList()
  if(pageParams.id) {
    getData()
  }
})
 
</script>

<style scoped lang="scss">
.option-button-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.form-bottom-wrap {
  display: flex;
  justify-content: center;
}
</style>
