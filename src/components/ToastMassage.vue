<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <transition-group name="toast-fade" tag="div" class="toast-list">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', toast.type]"
          @mouseenter="pauseTimer(toast.id)"
          @mouseleave="resumeTimer(toast.id)"
      >
        <span class="toast-message">{{ toast.message }}</span>
        <button class="close-btn" @click="removeToast(toast.id)">&times;</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
let nextId = 1

export default {
  name: 'ToastNotifications',
  data() {
    return {
      toasts: [],
      timers: {}
    }
  },
  methods: {
    /**
     * 添加一个通知
     * @param {String} message 文本内容
     * @param {String} type 类型: info, success, error, warning
     * @param {Number} duration 毫秒后自动关闭，默认3000
     */
    addToast(message, type = 'info', duration = 3000) {
      const id = nextId++
      this.toasts.push({ id, message, type })

      this.timers[id] = setTimeout(() => {
        this.removeToast(id)
      }, duration)

      return id
    },

    removeToast(id) {
      clearTimeout(this.timers[id])
      delete this.timers[id]

      const idx = this.toasts.findIndex(t => t.id === id)
      if (idx !== -1) this.toasts.splice(idx, 1)
    },

    pauseTimer(id) {
      clearTimeout(this.timers[id])
    },

    resumeTimer(id) {
      if (!this.timers[id]) return
      this.timers[id] = setTimeout(() => {
        this.removeToast(id)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  z-index: 9999;
  user-select: none;
  pointer-events: none; /* 允许点击穿透空白区域 */
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
  position: relative;
  min-height: 80px;
}

.toast {
  background-color: #2196f3;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  cursor: default;
}

.toast.success {
  background-color: rgba(76, 175, 80, 0.82);
}
.toast.error {
  background-color: rgba(244, 67, 54, 0.8);
}
.toast.warning {
  background-color: rgba(255, 152, 0, 0.86);
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  user-select: none;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s ease;
}

.toast-fade-leave-active {
  position: absolute;
  width: 100%;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>