<template>
  <div class="alert-wrap">
    <div
      class="alert alert-dismissible"
      role="alert"
      :class="`alert-${item.status}`"
      v-for="(item, index) in messages"
      :key="index">
      <div>{{ item.message }}</div>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="hideAlert(index)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const messages = computed(() => {
  return store.state.messageModules.messages
})
const hideAlert = (index: number) => {
  store.commit('removeMessage', index)
}
</script>

<style scoped lang="scss">
.alert-wrap {
  position: fixed;
  max-width: 60%;
  top: 100px;
  right: 100px;
  z-index: 9999;
}
</style>
