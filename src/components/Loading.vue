<template>
  <div
    class="spinner-wrap d-flex justify-content-center align-items-center"
    v-if="isLoading">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import store from '@/store'
const isLoading = computed(() => {
  return store.state.isLoading
})
</script>

<style scoped lang="scss">
.spinner-wrap {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
