<template>
  <el-menu :default-active="defaultActive" :collapse="isCollapse" @select="selectMenu">
    <el-menu-item index="product">
      <el-icon><icon-menu /></el-icon>
      <template #title>商品管理</template>
    </el-menu-item>
    <el-menu-item index="coupon">
      <el-icon><icon-menu /></el-icon>
      <template #title>優惠卷管理</template>
    </el-menu-item>
    <el-menu-item index="order">
      <el-icon><icon-menu /></el-icon>
      <template #title>訂單管理</template>
    </el-menu-item>
    <!-- 箭頭展開按鈕 -->
    <div class="sidebar-trigger" @click="toggleSideBar">
      <el-icon>
        <arrow-right v-if="isCollapse" />
        <arrow-left v-else />
      </el-icon>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'
import {
  Menu as IconMenu,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const defaultActive = ref(route.path.split('/')[2])
const selectMenu = (index: string) => {
  router.push(`/admin/${index}`)
}

const isCollapse = computed(() => store.state.isSidebarCollapse)
const toggleSideBar = () => {
  store.commit('setIsSidebarCollapse', !isCollapse.value)
}
</script>

<style lang="scss" scoped>
.el-menu {
  height: calc(100vh - 60px);
}
.sidebar-trigger {
  position: absolute;
  right: 11.5px;
  bottom: 15px;
  display: flex;
  width: 40px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>