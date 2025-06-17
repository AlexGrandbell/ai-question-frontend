<template>
  <div class="app-root">
    <HomeView />
  </div>
</template>

<script setup>
import HomeView from "@/view/HomeView.vue";
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 1200px;
  background-color: #f0f2f5;
  font-family: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Heiti SC", sans-serif;
}

.app-root {
  height: 100%;

}
</style>