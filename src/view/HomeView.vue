<template>
  <div class="app-container">
    <AppNavbar />
        <div class="main-body">
          <AppSidebar :collapsed="sidebarCollapsed" :current="currentView" @toggle="sidebarCollapsed = !sidebarCollapsed" @selectView="currentView = $event" />
          <div class="content-area" :class="{ collapsed: sidebarCollapsed }">
            <component :is="currentViewComponent" />
          </div>
        </div>
  </div>
</template>

<script setup>
import { ref ,computed} from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import AppSidebar from "@/components/AppSidebar.vue";
import QuestionManagerView from "@/view/QuestionManagerView.vue";
import MarkdownView from './MarkdownView.vue'
import SelfInfoView from "@/view/SelfInfoView.vue";

const sidebarCollapsed = ref(false)
const currentView = ref('QuestionManager')

const currentViewComponent = computed(() => {
  if (currentView.value === 'StudyNotes') return MarkdownView
  if (currentView.value === 'UserProfile') return SelfInfoView
  return QuestionManagerView
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.content-area {
  flex: 1;
  padding: 16px;
  transition: margin-left 0.3s;
}
.content-area.collapsed {
  margin-left: 0px;
}
</style>