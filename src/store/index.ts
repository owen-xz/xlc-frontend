import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    isSidebarCollapse: false
  },
  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload
    },
    setIsSidebarCollapse(state, payload) {
      state.isSidebarCollapse = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
