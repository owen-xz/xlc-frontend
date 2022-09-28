<template>
  <div class="page-wrap">
    <div class="title">請登入</div>
    <el-form
      ref="submitFormRef"
      class="form-signin"
      :model="submitForm"
      :rules="submitFormRules"
      label-position="top">
      <el-form-item label="Email" prop="email">
        <el-input v-model="submitForm.email" placeholder="請輸入 Email" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input v-model="submitForm.password" placeholder="請輸入密碼" />
      </el-form-item>
      <el-button class="loginBtn" type="primary" round @click="handleLogin">登入</el-button>
      <el-link @click="router.push({name: 'SignUp'})">註冊</el-link>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { pageLoading } from '@/utils/mixins'
import { login, fetchUserProfile } from '@/utils/api/back/login'

const router = useRouter()

let isSending = false
const submitFormRef = ref<FormInstance>()
const submitForm = reactive({
  email: '',
  password: ''
})
const validateEmail = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請輸入 Email'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請輸入密碼'))
  } else {
    callback()
  }
}
const submitFormRules = reactive<FormRules>({
  email: [{ validator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

const handleLogin = async() => {
  if(!submitFormRef.value) return
  if(isSending) return 
  await submitFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      isSending = true
      pageLoading(true)
      // 登入取得 token
      let token = ''
      {
        const { res, err } = await login(submitForm)
        if(res) {
          token = res.data
          localStorage.setItem('token', token)
        }
        if(err) {
          isSending = false
          pageLoading(false)
          ElMessage({
            message: `登入失敗，${err.data.message}`,
            type: 'error'
          })
          return
        }
      }
      // 取得個人檔案
      {
        const { res, err} = await fetchUserProfile()
        if(res) {
          isSending = false
          pageLoading(false)
          const { name, photo } = res.data
          localStorage.setItem('userInfo', JSON.stringify({
            token,
            name,
            photo
          }))
          ElMessage({
            message: '登入成功',
            type: 'success'
          })
          router.push({name: 'AdminProductList'})
        }
        if(err) {
          isSending = false
          pageLoading(false)
          ElMessage({
            message: '取得個人資料失敗',
            type: 'error'
          })
        }
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped lang="scss">
.page-wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title {
    @include font-h2;
  }
  .form-signin {
    width: 330px;
    padding: 15px;
    text-align: center;
    .loginBtn {
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>
