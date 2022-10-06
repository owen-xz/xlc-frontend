<template>
  <div class="main" v-loading="pageLoading">
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const pageLoading = computed(() => {
  return store.state.isLoading
})
</script>
<style lang="scss" scope>
.main {
  height: 100vh;
}
</style>
