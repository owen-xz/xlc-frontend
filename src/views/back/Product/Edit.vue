<template>
  <div class="page-content">
    <div class="page-header">
      <h2 class="page-title">{{ pageParams.id ? '編輯' : '新增' }}商品</h2>
    </div>
    <Form
      ref="submitFormRef"
      class="form form-signin w-100 m-auto"
      :validation-schema="submitFormSchema"
      v-slot="{ errors }"
      autocomplete="off">
      <div class="mb-4 row">
        <label class="form-label-inline" for="loginEmail">
          <span class="required-star">*</span>商品名稱
        </label>
        <div class="col-12 col-sm">
          <Field
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.productName }"
            id="productName"
            name="productName"
            placeholder="請輸入商品名稱"
            v-model="submitForm.name" />
          <ErrorMessage class="error-text text-danger" name="productName" />
        </div>
      </div>
      <div class="mb-4 row">
        <label class="form-label-inline" for="loginPassword">
          <span class="required-star">*</span>商品類型
        </label>
        <div class="col-12 col-sm">
          <Field
            as="select"
            class="form-select"
            :class="{ 'is-invalid': errors.productType, 'text-secondary': !submitForm.type }"
            id="productType"
            name="productType"
            v-model="submitForm.type">
            <option value="" disabled selected>請選擇器材</option>
            <option value="器材">器材</option>
          </Field>
          <ErrorMessage class="error-text text-danger" name="productType" />
        </div>
      </div>
      <div class="mb-4 row">
        <label class="form-label-inline" for="loginEmail">
          <span class="required-star">*</span>商品品項
        </label>
        <div class="col-12 col-sm">
          <div class="d-flex justify-content-end">
            <button class="btn btn-sm btn-primary" @click.prevent="showOptionModal(null)">
              新增品項
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th style="min-width: 200px" scope="col">品項名稱</th>
                  <th class="text-end text-nowrap" scope="col">原始價格</th>
                  <th class="text-end text-nowrap" scope="col">折扣價格</th>
                  <th class="text-end text-nowrap" scope="col">數量</th>
                  <th style="min-width: 150px;" class="text-nowrap" scope="col">操作</th>
                </tr>
              </thead>
              <tbody v-if="submitForm.options.length">
                <tr v-for="(item, index) in submitForm.options" :key="index">
                  <td>{{ item.name }}</td>
                  <td class="text-end">
                    ${{ item.price }}
                  </td>
                  <td class="text-end">
                    ${{ item.discountPrice }}
                  </td>
                  <td class="text-end">
                    {{ item.count }}
                  </td>
                  <td>
                    <button class="btn btn-link" @click.prevent="showOptionModal(index)">編輯</button>
                    <button class="btn btn-link" @click.prevent="deleteOption(index)">刪除</button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td class="text-center" :colspan="5">目前尚無資料</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="mb-4 row">
        <label class="form-label-inline" for="productStatus">是否上架</label>
        <div class="col-12 col-sm">
          <input class="form-check-input" type="checkbox" id="productStatus" v-model="submitForm.status">
        </div>
      </div>
      <div class="mb-4 row">
        <label class="form-label-inline" for="loginEmail">商品描述</label>
        <div class="col-12 col-sm">
          <textarea
            class="form-control"
            name="productDescription"
            id="productDescription"
            cols="30"
            rows="10"
            placeholder="請輸入商品描述"
            v-model="submitForm.description" />
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <button
          class="btn btn-lg btn-outline-primary me-2"
          @click.prevent="router.push({name: 'AdminProductList'})">
          取消
        </button>
        <button class="btn btn-lg btn-primary" type="submit" @click.prevent="sendData">儲存</button>
      </div>
    </Form>
    
    <div class="modal fade" id="optionModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="optionModalLabel">{{ optionModalType }}品項</h5>
            <button type="button" class="btn-close" @click.prevent="hideOptionModal"></button>
          </div>
          <div class="modal-body">
            <Form
              ref="optionFormRef"
              class="form form-signin w-100 m-auto"
              :validation-schema="optionFormSchema"
              v-slot="{ errors }"
              autocomplete="off">
              <div class="mb-4 row">
                <label class="form-label-inline" for="productOptionName">
                  <span class="required-star">*</span>品項名稱
                </label>
                <div class="col-12 col-sm">
                  <Field
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.productOptionName }"
                    id="productOptionName"
                    name="productOptionName"
                    placeholder="請輸入品項名稱"
                    v-model="tempOption.name" />
                  <ErrorMessage class="error-text text-danger" name="productOptionName" />
                </div>
              </div>
              <div class="mb-4 row">
                <label class="form-label-inline" for="productOptionPrice">
                  <span class="required-star">*</span>價格
                </label>
                <div class="col-12 col-sm">
                  <Field
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.productOptionPrice }"
                    id="productOptionPrice"
                    name="productOptionPrice"
                    placeholder="請輸入價格"
                    v-model.number="tempOption.price" />
                  <ErrorMessage class="error-text text-danger" name="productOptionPrice" />
                </div>
              </div>
              <div class="mb-4 row">
                <label class="form-label-inline" for="productOptionDiscountPrice">
                  <span class="required-star">*</span>折扣價格
                </label>
                <div class="col-12 col-sm">
                  <Field
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.productOptionDiscountPrice }"
                    id="productOptionDiscountPrice"
                    name="productOptionDiscountPrice"
                    placeholder="請輸入折扣價格"
                    v-model.number="tempOption.discountPrice" />
                  <ErrorMessage class="error-text text-danger" name="productOptionDiscountPrice" />
                </div>
              </div>
              <div class="mb-4 row">
                <label class="form-label-inline" for="productOptionCount">
                  <span class="required-star">*</span>數量
                </label>
                <div class="col-12 col-sm">
                  <Field
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': errors.productOptionCount }"
                    id="productOptionCount"
                    name="productOptionCount"
                    placeholder="請輸入數量"
                    v-model.number="tempOption.count" />
                  <ErrorMessage class="error-text text-danger" name="productOptionCount" />
                </div>
              </div>
            </Form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click.prevent="hideOptionModal">取消</button>
            <button type="button" class="btn btn-primary" @click.prevent="editOption">確認</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authorization, showAlert, pageLoading } from '@/utils/mixins'
import schema from '@/utils/vee-validate-schema'

const axios: any = inject('axios')
const bootstrap: any = inject('bootstrap')
const route = useRoute()
const router = useRouter()

const pageParams = reactive({
  id: route.params.id || null
})
interface Option {
  name: string
  price: null | number
  discountPrice: null | number
  count: null | number
}
const submitFormSchema = reactive({
  productName: schema.productName,
  productType: schema.productType
})
const submitForm = ref({
  name: '',
  type: '',
  options: [] as Array<Option>,
  description: '',
  status: true
})

const getData =  async() => {
  pageLoading(true)
  const url = `${process.env.VUE_APP_XLC_API}product/${pageParams.id}`
  try {
    const res = await axios.get(url, {
      ...authorization()
    })
    const { name, type, options, description, status } = res.data.data
    submitForm.value = {
      name,
      type,
      options,
      description,
      status
    }
    pageLoading(false)
  } catch (err: any) {
    pageLoading(false)
    showAlert('danger', '取得資料失敗')
  }
}

// 品項彈窗
const optionFormSchema = reactive({
  productOptionName: schema.productOptionName,
  productOptionPrice: schema.productOptionPrice,
  productOptionDiscountPrice: schema.productOptionDiscountPrice,
  productOptionCount: schema.productOptionCount
})
const tempOption = ref({
  name: '',
  price: null as number | null,
  discountPrice: null as number | null,
  count: null as number | null
})
const optionModalType = ref('')
let tempOptionIndex = null as number | null
const optionFormRef = ref<any>(null)
const optionModal = ref<any>(null)

const showOptionModal = (index: number | null = null) => {
  tempOptionIndex = index
  if(tempOptionIndex !== null) {
    optionModalType.value = '編輯'
    tempOption.value = { ...submitForm.value.options[tempOptionIndex] }
  } else {
    optionModalType.value = '新增'
    tempOption.value = {
      name: '',
      price: null,
      discountPrice: null,
      count: null
    }
  }
  optionModal.value.show()
}
const hideOptionModal = async () => {
  optionModal.value.hide()
  await optionFormRef.value.resetForm()
}

const editOption = async() => {
  const { valid } = await optionFormRef.value.validate()
  if(!valid) return false
  if(tempOptionIndex !== null) {
    submitForm.value.options[tempOptionIndex] = { ...tempOption.value }
  } else {
    submitForm.value.options.push(tempOption.value)
  }
  optionModal.value.hide()
}
const deleteOption = (index: number) => {
  submitForm.value.options.splice(index, 1)
}

// 送出表單
const sendData =  async() => {
  pageLoading(true)
  const patchUrl = `${process.env.VUE_APP_XLC_API}product/${pageParams.id}`
  const postUrl = `${process.env.VUE_APP_XLC_API}product`
  const params = submitForm.value
  try {
    if(pageParams.id) {
      await axios.patch(patchUrl, params, {
        ...authorization()
      })
    } else {
      await axios.post(postUrl, params, {
        ...authorization()
      })
    }
    pageLoading(false)
    showAlert('success', '送出資料成功')
    router.push({name: 'AdminProductList'})
  } catch (err: any) {
    pageLoading(false)
    showAlert('danger', `送出資料失敗，${err.response.data.message}`)
  }
}

onMounted(() => {
  optionModal.value = new bootstrap.Modal(document.getElementById('optionModal'))
  if(pageParams.id) {
    getData()
  }
})
 
</script>

<style scoped lang="scss">
.form-label-inline {
  width: 120px;
  text-align: right;
}
</style>
