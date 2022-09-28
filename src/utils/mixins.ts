import store from '@/store'

export function pageLoading(status: boolean) {
  store.commit('setIsLoading', status)
}
