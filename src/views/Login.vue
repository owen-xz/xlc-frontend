<template>
  <div class="page-wrap d-flex align-item-center">
    <Form
      ref="submitFormRef"
      class="form form-signin w-100 m-auto"
      :validation-schema="submitFormSchema"
      v-slot="{ errors }"
      autocomplete="off">
      <h1 class="h3 mb-5 fw-normal">請登入</h1>
      <div class="form-floating mb-4">
        <Field
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.loginEmail }"
          id="loginEmail"
          name="loginEmail"
          placeholder="請輸入 Email"
          v-model="submitForm.email" />
        <label for="loginEmail">Email</label>
      </div>
      <div class="form-floating">
        <Field
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.loginPassword }"
          id="loginPassword"
          name="loginPassword"
          placeholder="請輸入密碼"
          v-model="submitForm.password" />
        <label for="loginPassword">密碼</label>
      </div>
      <div class="mt-5">
        <button class="w-100 btn btn-lg btn-primary mb-3" type="submit" @click.prevent="login">登入</button>
        <router-link :to="{name: 'SignUp'}">註冊</router-link>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import schema from '@/utils/vee-validate-schema'
import { authorization, showAlert, pageLoading } from '@/utils/mixins'

const axios: any = inject('axios')
const router = useRouter()

let isSending = false
const submitFormSchema = reactive({
  loginEmail: schema.loginEmail,
  loginPassword: schema.loginPassword
})
const submitFormRef = ref(null as any)
const submitForm = reactive({
  email: '',
  password: ''
})

const login = async() => {
  if(isSending) return false
  const { valid } = await submitFormRef.value.validate()
  if(!valid) {
    showAlert('danger', '請輸入 Email 與密碼')
    return false
  }
  isSending = true
  pageLoading(true)
  const loginUrl = `${process.env.VUE_APP_XLC_API}users/sign_in`
  const getUserUrl = `${process.env.VUE_APP_XLC_API}users/profile`
  const { email, password } = submitForm
  const params = {
    email,
    password
  }
  try {
    // 登入取得 token
    const res1 = await axios.post(loginUrl, params)
    const token = res1.data.data
    localStorage.setItem('token', token)
    
    // 取得個人檔案
    const res2 = await axios.get(getUserUrl, authorization())
    isSending = false
    pageLoading(false)
    
    localStorage.setItem('userInfo', JSON.stringify({
      token,
      name: res2.data.data.name,
      photo: res2.data.data.photo
    }))
    showAlert('success', '登入成功')
    router.push('/')
  } catch (err: any) {
    isSending = false
    pageLoading(false)
    showAlert('danger', `登入失敗，${err.response.data.message}`)
  }
}
</script>

<style scoped lang="scss">
.page-wrap {
  height: 100vh;
}
.form-signin {
  max-width: 330px;
  padding: 15px;
  text-align: center;
}
</style>
