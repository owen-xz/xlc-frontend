interface Message {
  status: string
  message: string
  timestamp: number
}
export default {
  state: {
    messages: [] as Array<Message>,
    isConfirmShow: false,
    confirmMessage: {
      status: 'success',
      title: '提示',
      content: '',
      confirmBtn: '確定',
      callback: null as null | (() => any)
    }
  },
  mutations: {
    createMessage(state: any, payload: any) {
      const timestamp = new Date().valueOf()
      state.messages.push({
        ...payload,
        timestamp
      })
      return timestamp
    },
    removeMessage(state: any, payload: any) {
      state.messages.splice(payload, 1)
    },
    changeIsConfirmShow(state: any, payload: any) {
      state.isConfirmShow = payload
    },
    createConfirmMessage(state: any, payload: any) {    
      state.confirmMessage = payload
    },
    resetConfirmMessage(state: any) {
      state.conformMessage = {
        status: 'success',
        title: '提示',
        content: '',
        confirmBtn: '確定',
        callback: null
      }
    }
  },
  actions: {
    showMessage(context: any, payload: any) {
      const { commit, state } = context
      const timestamp = commit('createMessage', payload)
      setTimeout(() => {
        const index = state.messages.findIndex((item: Message) => item.timestamp === timestamp)
        commit('removeMessage', index)
      }, 3000)
    },
  }
}
