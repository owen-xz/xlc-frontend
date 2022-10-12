import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './type'
import { fetchPageList } from '@/utils/api/back/common'
import { ElMessage } from 'element-plus'

const store: StoreOptions<RootState> = {
  state: {
    isLoading: false,
    isSidebarCollapse: false,
    pageList: {}
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
}

export default new Vuex.Store<RootState>(store);
