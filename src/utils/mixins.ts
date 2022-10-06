import store from '@/store'

export function pageLoading(status: boolean) {
  store.commit('setIsLoading', status)
}

export function getPageList(featureName: string) {
  if(!store.state.pageList[featureName]) {
    store.dispatch('getPageList', featureName)
  }
}