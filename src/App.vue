<template>
  <Loading />
  <Alert />
  <Confirm />
  <router-view />
</template>
<script lang="ts" setup>
import Alert from './components/Alert.vue'
import Confirm from './components/Confirm.vue'
import Loading from './components/Loading.vue'
</script>
<style lang="scss">
@import "./assets/all";
</style>
