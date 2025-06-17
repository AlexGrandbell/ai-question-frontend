<template>
  <div class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="logo" class="logo" />
      <span class="title">武汉理工大学-软件系统设计与开发实践-大作业</span>
    </div>
  </div>
</template>

<script setup>
//静态导航栏，无交互逻辑
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
</style>