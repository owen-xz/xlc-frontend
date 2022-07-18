import { createStore } from 'vuex'
import messageModules from './message'

export default createStore({
  state: {
    isLoading: false
  },
  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload
    }
  },
  actions: {
  },
  modules: {
    messageModules
  }
})
