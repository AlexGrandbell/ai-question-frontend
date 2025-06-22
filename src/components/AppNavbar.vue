<template>
  <div class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="logo" class="logo" />
      <span class="title">武汉理工大学-软件系统设计与开发实践-大作业</span>
    </div>
    <div class="navbar-right">
      <span class="greeting">{{ greeting }}, {{ user.username }}</span>
      <img src="@/assets/icons/power.svg" alt="logout" class="logout-icon" @click="handleLogout" />
    </div>
  </div>
</template>

<script setup>
import { getUserInfo } from '@/utils/auth';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const user = getUserInfo();
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 4) return '早点休息';
  if (hour < 11) return '上午好';
  else if (hour < 13) return '中午好';
  else if (hour < 18) return '下午好';
  else return '晚上好';
});

const router = useRouter();
const handleLogout = () => {
  localStorage.removeItem('user');
  router.push('/login');
};
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
  display: flex;
  align-items: center;
  margin-left: auto;
  user-select: none;
}
.greeting {
  font-size: 18px;
  color: #ffffff;
}
.logout-icon {
  width: 22px;
  height: 22px;
  margin-left: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.logout-icon:hover {
  opacity: 0.7;
}
</style>