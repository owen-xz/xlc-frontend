<template>
  <div id="confirmModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ message.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" />
        </div>
        <div class="modal-body">
          <p>{{ message.content }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button
            type="button"
            class="btn"
            :class="`btn-${message.status}`"
            @click="callback(message.callback)">
            {{ message.confirmBtn }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useStore } from 'vuex'

const bootstrap: any = inject('bootstrap')
const store = useStore()

const confirmModal = ref<any>(null)
const isConfirmShow = computed(() => {
  return store.state.messageModules.isConfirmShow
})
const message = computed(() => {
  return store.state.messageModules.confirmMessage
})

const callback = async(fn: null | (() => any)) => {
  if(fn) {
    await fn()
    confirmModal.value.hide()
  } else {
    confirmModal.value.hide()
  }
}

watch(
  isConfirmShow,
  (curVal) => {
    if(curVal) {
      confirmModal.value.show()
    } else {
      confirmModal.value.hide()
    }
  }
)

onMounted(() => {
  const confirmModalRef = document.getElementById('confirmModal')
  if(confirmModalRef) {
    confirmModal.value = new bootstrap.Modal(confirmModalRef)
    confirmModalRef.addEventListener('hidden.bs.modal', () => {
      store.commit('changeIsConfirmShow', false)
      store.commit('resetConfirmMessage')
    })
  }
})
</script>

<style scoped lang="scss">
</style>
