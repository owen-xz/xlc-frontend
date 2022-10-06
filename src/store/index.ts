import { createStore } from 'vuex'
import { fetchPageList } from '@/utils/api/back/common'
import { ElMessage } from 'element-plus'

interface PageList {
  [key: string]: {
    [key: string]: {
      id: number
      name: string
    }[]
  }
}

export default createStore({
  state: {
    isLoading: false,
    isSidebarCollapse: false,
    pageList: {} as PageList
  },
  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload
    },
    setIsSidebarCollapse(state, payload) {
      state.isSidebarCollapse = payload
    },
    setPageList(state, payload) {
      state.pageList[payload.featureName] = payload.pageList
    }
  },
  actions: {
    async getPageList({ commit }, payload) {
      const params = {
        featureName: payload
      }
      const { res, err } = await fetchPageList(params)
      if(res) {
        commit('setPageList', {
          featureName: payload,
          pageList: res.data
        })
      }
      if(err) {
        ElMessage({
          message: '取得資料失敗',
          type: 'error'
        })
      }
    }
  },
  modules: {
  }
})
