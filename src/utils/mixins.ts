import store from '@/store'

export function pageLoading(status: boolean) {
  store.commit('setIsLoading', status)
}

export function getTypeList() {
  if(!store.state.typeList.length) {
    store.dispatch('getTypeList')
  }
}