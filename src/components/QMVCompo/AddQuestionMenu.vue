<template>
  <div class="add-question-menu" ref="menuRoot">
    <button class="main-button" @click="toggleMenu">
      <img src="../../assets/icons/plus.svg" alt="plus" />
      <span>出题</span>
      <img :src="showMenu ? require('@/assets/icons/up.svg') : require('@/assets/icons/down.svg')" alt="arrow" />
    </button>
    <transition name="fade-scale">
      <div v-if="showMenu" class="dropdown">
        <div class="arrow"></div>
        <div class="dropdown-content">
          <button @click="select('AI')">AI出题</button>
          <button @click="select('manual')">自主出题</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AddQuestionMenu',
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    select(type) {
      this.showMenu = false
      this.$emit('select', type)
    },
    handleClickOutside(e) {
      if (this.$refs.menuRoot && !this.$refs.menuRoot.contains(e.target)) {
        this.showMenu = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.add-question-menu {
  position: relative;
}
.main-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border:none;
  background: #2196f3;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease;
}
.main-button:hover {
  transform: scale(1.05);
}
.main-button:active {
  transform: scale(0.98);
}
.main-button img {
  width: 16px;
  height: 16px;
}
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  z-index: 1000;
}
.arrow {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
  margin-left: 12px;
  position: relative;
  z-index: 2;
}
.dropdown-content {
  background: white;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.29);
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.dropdown-content button {
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.09);
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background-color 0.2s ease;
}
.dropdown-content button:hover {
  background-color: #ecf0f1;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
img {
  pointer-events: auto;
  user-drag: none;
  -webkit-user-drag: none;
}
</style>
