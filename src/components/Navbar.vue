<template>
  <div class="navbar">
    <div class="logo">Title</div>
    <span class="drawer-link" @click="drawer = true">
      <span class="userName">{{ userName }}</span>
      <el-icon>
        <arrow-down />
      </el-icon>
    </span>
    <el-drawer v-model="drawer" :direction="direction" custom-class="navbar-drawer" :append-to-body="true">
      <template #default>
        <div class="menu">
          <div class="menu-item">
            <router-link to="/">首頁</router-link>
          </div>
          <div class="menu-item">
            <router-link to="/admin">管理後臺</router-link>
          </div>
          <div class="menu-item">
            <router-link to="/">登出</router-link>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()

const userName = ref('')
const drawer = ref(false)

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
    .drawer-link {
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
  .navbar-drawer {
    .el-drawer__body {
      padding: 0;
      .menu {
        list-style: none;
        width: 100%;
        .menu-item a {
          display: block;
          padding: 15px 50px;
          border-bottom: 1px solid $systemBorderGray;
          color: #000;
          transition: all 0.3s;
          &:hover {
            background-color: $primaryColor;
            color: #fff;
          }
        }
      }
    }
  }
</style>