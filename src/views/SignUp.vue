<template>
  <div class="page-wrap">
    <div class="title">申請帳號</div>
    <el-form
      ref="submitFormRef"
      class="form-signin"
      :model="submitForm"
      :rules="submitFormRules"
      label-position="top">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="submitForm.name" placeholder="請輸入姓名" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="submitForm.email" placeholder="請輸入 Email" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input v-model="submitForm.password" placeholder="請輸入密碼" />
      </el-form-item>
      <el-form-item label="再次輸入密碼" prop="confirmPassword">
        <el-input v-model="submitForm.confirmPassword" placeholder="請再次輸入密碼" />
      </el-form-item>
      <el-button class="signUpBtn" type="primary" round @click="sendSubmitForm">註冊</el-button>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { pageLoading } from '@/utils/mixins'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { signUp } from '@/utils/api/back/login'

const router = useRouter()

let isSending = false
const submitFormRef = ref<FormInstance>()
const submitForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const validateName = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請輸入姓名'))
  } else {
    callback()
  }
}
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
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('請再次輸入密碼'))
  } else {
    callback()
  }
}
const submitFormRules = reactive<FormRules>({
  name: [{ validator: validateName, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
})

const sendSubmitForm = async() => {
  if(!submitFormRef.value) return
  if(isSending) return 
  await submitFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      isSending = true
      pageLoading(true)
      const { res, err } = await signUp(submitForm)
      if(res) {
        isSending = false
        pageLoading(false)
        ElMessage({
          message: '註冊成功',
          type: 'success'
        })
        router.push({name: 'Login'})
      }
      if(err) {
        isSending = false
        pageLoading(false)
        ElMessage({
          message: `註冊失敗，${err.response.data.message}`,
          type: 'error'
        })
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
    .signUpBtn {
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>
