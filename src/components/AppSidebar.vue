<template>
  <div class="sidebar" :class="{ collapsed }">
    <div class="menu-items">
      <div
          class="menu-item"
          :class="{ active: current === 'StudyNotes' }"
          @click="handleSelect('StudyNotes')"
      >
        <img src="@/assets/icons/edit.svg" class="icon" />
        <span class="menu-label" :class="{ visible: !collapsed }" v-if="!collapsed">学 习 心 得</span>
      </div>
      <div
          class="menu-item"
          :class="{ active: current === 'QuestionManager' }"
          @click="handleSelect('QuestionManager')"
      >
        <img src="@/assets/icons/book.svg" class="icon" />
        <span class="menu-label" :class="{ visible: !collapsed }" v-if="!collapsed">题 库 管 理</span>
      </div>
      <div
          class="menu-item"
          :class="{ active: current === 'UserProfile' }"
          @click="handleSelect('UserProfile')"
      >
        <img src="@/assets/icons/person.svg" class="icon" />
        <span class="menu-label" :class="{ visible: !collapsed }" v-if="!collapsed">个 人 中 心</span>
      </div>
    </div>
    <div class="collapse-toggle" @click="handleToggle">
      <img
        :src="collapsed ? require('@/assets/icons/right.svg') : require('@/assets/icons/left.svg')"
        alt="toggle"
        class="toggle-icon"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    collapsed: {
      type: Boolean,
      required: true
    },
    current: {
      type: String,
      required: true
    }
  },
  emits: ['toggle', 'selectView'],
  methods: {
    handleSelect(view) {
      this.$emit('selectView', view)
    },
    handleToggle() {
      this.$emit('toggle')
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 230px;
  background-color: #34495e;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
  user-select: none;
}
img {
  pointer-events: auto;
  user-drag: none;
  -webkit-user-drag: none;
}
.sidebar.collapsed {
  width: 85px;
}
.menu-items {
  flex: 1;
  padding-top: 20px;
}
.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 20px;
  border-radius: 10px;
  margin: 10px;
  transition: background-color 0.2s;
}
.menu-item:hover {
  background-color: rgba(91, 177, 246, 0.3);
}
.menu-item.active {
  background-color: #2196f3;
}
.icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}
.collapse-toggle {
  padding: 10px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.toggle-icon {
  width: 30px;
  height: 30px;
}
.menu-label {
  opacity: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.2s ease 0.1s;
}
.menu-label.visible {
  opacity: 1;
}
</style>