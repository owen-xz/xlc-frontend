<template>
  <el-container>
    <el-header>
      <Navbar />
    </el-header>
    <el-container>
      <el-aside class="app-sidebar" :width="sidebarWidth">
        <Sidebar />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import store from '@/store'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const sidebarWidth = computed(() => {
  return store.state.isSidebarCollapse ? '64px' : '200px'
})
</script>
<style lang="scss" scoped>
.el-header {
  padding: 0;
  z-index: 1;
}
.el-aside {
  transition: width, 0.3s;
}
</style>
