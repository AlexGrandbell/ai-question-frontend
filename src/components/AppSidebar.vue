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
  width: 250px;
  background-color: #34495e;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
  user-select: none;
}
.sidebar.collapsed {
  width: 60px;
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
  gap: 30px;
  transition: background-color 0.2s;
}
.menu-item:hover {
  background-color: #3e5871;
}
.menu-item.active {
  background-color: #1abc9c;
}
.icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
  filter: invert(100%);
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
  filter: invert(100%);
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