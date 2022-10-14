<template>
  <div class="page-content">
    <div class="filter">
      <div class="filter-title">依下方條件查詢</div>
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="優惠券序號">
              <el-input v-model="filterData.couponSn" placeholder="請輸入優惠券序號" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="啟用狀態">
              <el-select v-model="filterData.enable" placeholder="請選擇啟用狀態" multiple>
                <el-option label="啟用" :value="true" />
                <el-option label="停用" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效日期">
              <el-date-picker
                v-model="filterData.effectiveAt"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                format="YYYY-MM-DD"
              />
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
      <div class="page-title">優惠券列表</div>
      <el-button type="primary" @click="goEdit(null)">新增優惠券</el-button>
    </div>
    <el-table
      :data="listData"
      stripe
      empty-text="目前尚無資料">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column prop="couponSn" label="優惠券序號" min-width="200" />
      <el-table-column prop="discount" label="折扣" width="80" />
      <el-table-column prop="enable" label="啟用狀態" width="80">
        <template #default="scope">
          <span>{{ scope.row.enable ? '啟用' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="開始時間" width="150">
        <template #default="scope">
          <span>{{ dayjs(scope.row.startAt).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="結束時間" width="150">
        <template #default="scope">
          <span>{{ dayjs(scope.row.dueAt).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" @click.prevent="goEdit(scope.row)">編輯</el-button>
          <el-button size="small" @click.prevent="handleDeleteCoupon(scope.row._id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="editDialogVisible"
      :title="`${editDialogType}優惠券`"
      width="50%"
      @closed="handleCloseEditDialog">
      <el-form :model="submitForm" ref="submitFormRef" :rules="submitFormRules" label-width="100px">
        <el-form-item label="優惠券序號" prop="couponSn">
          <el-input v-model="submitForm.couponSn" placeholder="請輸入優惠券序號" />
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input type="number" v-model.number="submitForm.discount" placeholder="請輸入折扣 (需介於 0 ~ 1 之間)" />
        </el-form-item>
        <el-form-item label="是否啟用">
          <el-checkbox v-model="submitForm.enable" />
        </el-form-item>
        <el-form-item label="有效時間" prop="effectiveAt">
          <el-date-picker
            v-model="submitForm.effectiveAt"
            type="datetimerange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            format="YYYY-MM-DD HH:mm">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="submitForm.description" placeholder="請輸入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sendSubmitForm">確認</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, inject } from 'vue'
import { pageLoading } from '@/utils/mixins'
import { fetchCouponList, postCoupon, patchCoupon, deleteCoupon } from '@/utils/api/back/coupon'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const dayjs = inject('$dayjs') as any

const filterData = ref({
  couponSn: '',
  enable: [] as boolean[],
  effectiveAt: [] as Date[]
})

interface CouponListItem {
  _id: string
  couponSn: string
  discount: number
  enable: boolean
  startAt: string
  dueAt: string
  description: string
}
const listData = ref([] as Array<CouponListItem>)
const getList =  async () => {
  pageLoading(true)
  const { res, err } = await fetchCouponList(filterData.value)
  if(res) {
    pageLoading(false)
    listData.value = res.data
  }
  if(err) {
    pageLoading(false)
    console.log(err);
  }
}

// 搜尋
const search = () => {
  getList()
}

// 清除
const clear = () => {
  filterData.value = {
    couponSn: '',
    enable: [],
    effectiveAt: []
  }
  getList()
}

// 新增編輯彈窗
const editDialogVisible = ref(false)
const editDialogType = ref('')
const submitFormRef = ref<FormInstance>()
const submitForm = ref({
  couponId: '',
  couponSn: '',
  discount: null as null | number,
  enable: false,
  effectiveAt: [] as Date[],
  description: ''
})
const validateDiscount = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請輸入折扣'))
  } else if (value < 0 || value > 1) {
    callback(new Error("折扣需介於 0 ~ 1 之間"))
  } else {
    callback()
  }
}
const submitFormRules = reactive<FormRules>({
  couponSn: [{ required: true, message: '請輸入優惠券序號', trigger: 'blur' }],
  discount: [{ validator: validateDiscount, required: true, trigger: 'blur' }],
  effectiveAt: [{ required: true, message: '請選擇有效時間', trigger: 'blur' }],
})

const goEdit = (coupon: CouponListItem | null) => {
  editDialogVisible.value = true
  if(coupon) {
    editDialogType.value = '編輯'
    const { _id, startAt, dueAt, ...others  } = coupon
    console.log(startAt);
    console.log(new Date(startAt));
    
    
    submitForm.value = {
      ...others,
      effectiveAt: [new Date(startAt), new Date(dueAt)],
      couponId: _id
    }
  } else {
    editDialogType.value = '新增'
  }
}

const handleCloseEditDialog = () => {
  submitForm.value = {
    couponId: '',
    couponSn: '',
    discount: null,
    enable: false,
    effectiveAt: [],
    description: ''
  }
}

const sendSubmitForm = async () => {
  await submitFormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      pageLoading(true)
      const { couponId, discount, ...others } = submitForm.value
      const params = {
        ...others,
        discount: discount as number
      }
      if(couponId) {
        const restfulParam = {
          couponId
        }
        const { res, err } = await patchCoupon(restfulParam, params)
        if(res) {
          pageLoading(false)
          ElMessage({
            message: '編輯優惠券成功',
            type: 'success'
          })
          editDialogVisible.value = false
          getList()
        }
        if(err) {
          pageLoading(false)
          ElMessage({
            message: '編輯優惠券失敗',
            type: 'error'
          })
        }
      } else {
        const { res, err } = await postCoupon(params)
        if(res) {
          pageLoading(false)
          ElMessage({
            message: '新增優惠券成功',
            type: 'success'
          })
          editDialogVisible.value = false
          getList()
        }
        if(err) {
          pageLoading(false)
          ElMessage({
            message: '新增優惠券失敗',
            type: 'error'
          })
        }
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 刪除優惠券
const handleDeleteCoupon = async (id: string) => {
  ElMessageBox.confirm(
    '確定要刪除此優惠券嗎？',
    '警告',
    {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  .then(async () => {
    pageLoading(true)
    const restfulParam = {
      couponId: id
    }
    const { res, err } = await deleteCoupon(restfulParam)
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
  getList()
})
</script>

<style scoped lang="scss">
.page-title {
  @include font-h2;
}
</style>
