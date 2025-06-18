<template>
  <div class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="logo" class="logo" />
      <span class="title">武汉理工大学-软件系统设计与开发实践-大作业</span>
    </div>
    <div class="navbar-right">
      <span class="greeting">{{ greeting }}, {{ user.username }}</span>
    </div>
  </div>
</template>

<script setup>
import { getUserInfo } from '@/utils/auth';
import { computed } from 'vue';

const user = getUserInfo();
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 11) return '上午好';
  else if (hour < 14) return '中午好';
  else return '晚上好';
});
</script>

<style scoped>
.navbar {
  height: 70px;
  background-color: #2d3e50;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
}
.navbar-left {
  display: flex;
  align-items: center;
}
.logo {
  height: 50px;
  width: auto;
  margin-right: 15px;
  user-drag: none;
  -webkit-user-drag: none;
  pointer-events: none;
}
.title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  user-select: none;
  pointer-events: none;
}
.navbar-right {
  margin-left: auto;
  user-select: none;
}
.greeting {
  font-size: 18px;
  color: #ffffff;
}
</style>