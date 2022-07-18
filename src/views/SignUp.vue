<template>
  <div class="page-wrap d-flex align-item-center">
    <Form
      ref="submitFormRef"
      class="form form-signin w-100 m-auto"
      :validation-schema="submitFormSchema"
      v-slot="{ errors }"
      autocomplete="off">
      <h1 class="h3 mb-5 fw-normal">申請帳號</h1>
      <div class="form-floating mb-4">
        <Field
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          id="name"
          name="name"
          placeholder="請輸入姓名"
          v-model="submitForm.name" />
        <label for="name">姓名</label>
        <ErrorMessage class="error-text text-danger" name="name" />
      </div>
      <div class="form-floating mb-4">
        <Field
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          id="email"
          name="email"
          placeholder="請輸入 Email"
          v-model="submitForm.email" />
        <label for="email">Email</label>
        <ErrorMessage class="error-text text-danger" name="email" />
      </div>
      <div class="form-floating mb-4">
        <Field
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          id="password"
          name="password"
          placeholder="請輸入密碼"
          v-model="submitForm.password" />
        <label for="password">密碼</label>
        <ErrorMessage class="error-text" name="password" />
      </div>
      <div class="form-floating mb-4">
        <Field
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.confirmPassword }"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="請輸入密碼"
          v-model="submitForm.confirmPassword" />
        <label for="confirmPassword">再次確認密碼</label>
        <ErrorMessage class="error-text" name="confirmPassword" />
      </div>
      <div class="mt-5">
        <button
          class="w-100 btn btn-lg btn-primary mb-4"
          @click.prevent="sendSubmitForm">
          註冊
        </button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import schema from '@/utils/vee-validate-schema'
import { showAlert, pageLoading } from '@/utils/mixins'

const axios: any = inject('axios')
const router = useRouter()

let isSending = false
const submitFormRef = ref(null as any)
const submitForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const submitFormSchema = reactive({
  name: schema.name,
  email: schema.email,
  password: schema.password,
  confirmPassword: schema.confirmPassword
})
const sendSubmitForm = async() => {
  if(isSending) return false
  const { valid } = await submitFormRef.value.validate()
  if(!valid) return false
  isSending = true
  pageLoading(true)
  const url = `${process.env.VUE_APP_XLC_API}users/sign_up`
  const { name, email, password } = submitForm
  const params = {
    name,
    email,
    password
  }
  try {
    await axios.post(url, params)
    isSending = false
    pageLoading(false)
    showAlert('success', '註冊成功')
    router.push({name: 'Login'})
  } catch (err: any) {
    isSending = false
    pageLoading(false)
    showAlert('danger', `註冊失敗，${err.response.data.message}`)
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
.error-text {
  position: absolute;
  right: 0;
}
</style>
