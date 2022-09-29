import { createStore } from 'vuex'
import { fetchTypeList } from '@/utils/api/back/type'
import { ElMessage } from 'element-plus'

export default createStore({
  state: {
    isLoading: false,
    isSidebarCollapse: false,
    typeList: []
  },
  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload
    },
    setIsSidebarCollapse(state, payload) {
      state.isSidebarCollapse = payload
    },
    setTypeList(state, payload) {
      state.typeList = payload
    }
  },
  actions: {
    async getTypeList({ commit }) {
      const { res, err } = await fetchTypeList()
      if(res) {
        commit('setTypeList', res.data)
      }
      if(err) {
        ElMessage({
          message: '取得類型失敗',
          type: 'error'
        })
      }
    }
  },
  modules: {
  }
})
