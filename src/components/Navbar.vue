<template>
  <div class="navbar">
    <div class="logo">Title</div>
    <el-dropdown trigger="click" popper-class="navbar-popper">
      <span class="el-dropdown-link">
        <span class="userName">{{ userName }}</span>
        <el-icon>
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="router.push('/')">首頁</el-dropdown-item>
          <el-dropdown-item>登出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()

const userName = ref('')
onMounted(() => {
  if(localStorage.getItem('userInfo')) {
    userName.value = JSON.parse(localStorage.getItem('userInfo') as string).name
  }
})
</script>

<style lang="scss" scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.4);
    .logo {
      margin-left: 20px;
      font-size: 24px;
    }
    .el-dropdown-link {
      cursor: pointer;
      margin-right: 20px;
      .userName {
        font-size: 20px;
        margin-right: 10px;
      }
    }
  }
</style>
<style lang="scss">
  .navbar-popper {
    .el-dropdown-menu__item {
      padding: 10px 30px;
    }
  }
</style>