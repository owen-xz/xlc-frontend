import store from '@/store'

export function authorization() {
  const token = localStorage.getItem('token') || ''
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  return config
}

export function showAlert(status: string, message: string) {
  store.dispatch('showMessage', {
    status,
    message
  })
}

interface ConfirmConfig {
  status?: string
  title?: string
  content?: string
  confirmBtn?: string
  callback?: () => any
}
export function showConfirm(config: ConfirmConfig) {
  store.commit('createConfirmMessage', config)
  store.commit('changeIsConfirmShow', true)
}

export function pageLoading(status: boolean) {
  store.commit('setIsLoading', status)
}
