<template>
  <div class="dialog-overlay">
    <div class="dialog-box">
      <div class="dialog-header">
        <h2 class="header-title">
          题目信息
          <img
            :src="copied ? require('@/assets/icons/check.svg') : require('@/assets/icons/copy.svg')"
            class="copy-icon"
            @click="copyQuestion"
            alt="复制"
          />
        </h2>
        <div class="close-button" @click="$emit('close')"></div>
      </div>
      <div class="dialog-content">
        <p><strong>题目类型：</strong>{{ typeLabel }}</p>
        <p ><strong>题目内容：</strong>{{ question.content }}</p>
        <div v-if="question.type !== 'PROGRAMMING'">
          <p style="margin-bottom: 0"><strong>选项：</strong></p>
          <div v-for="opt in parsedOptions" :key="opt.key">{{ opt.key }}. {{ opt.text }}</div>
        </div>
        <p v-if="question.type !== 'PROGRAMMING'"><strong>答案：</strong>{{ question.answer }}</p>
        <p><strong>难度：</strong>
          <span :class="['difficulty-tag', difficultyClass]">{{ difficultyLabel }}</span>
        </p>
        <p><strong>考点语言：</strong>{{ question.language }}</p>
        <p><strong>创建时间：</strong>{{ formattedTime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionDetailDialog',
  props: {
    question: Object
  },
  data() {
    return {
      copied: false
    }
  },
  computed: {
    parsedOptions() {
      try {
        const options = JSON.parse(this.question.options || '{}')
        return Object.entries(options).map(([key, text]) => ({ key, text }))
      } catch (e) {
        return []
      }
    },
    typeLabel() {
      switch (this.question.type) {
        case 'SINGLE_CHOICE': return '单选题'
        case 'MULTIPLE_CHOICE': return '多选题'
        case 'PROGRAMMING': return '编程题'
        default: return this.question.type
      }
    },
    difficultyLabel() {
      switch (this.question.difficulty) {
        case 'EASY': return '简单'
        case 'MEDIUM': return '中等'
        case 'HARD': return '困难'
        default: return this.question.difficulty
      }
    },
    formattedTime() {
      return new Date(this.question.createdAt).toLocaleString()
    },
    difficultyClass() {
      switch (this.question.difficulty) {
        case 'EASY': return 'diff-easy'
        case 'MEDIUM': return 'diff-medium'
        case 'HARD': return 'diff-hard'
        default: return ''
      }
    }
  },
  methods: {
    copyQuestion() {
      let text = this.question.content + '\n'
      if (this.question.type !== 'PROGRAMMING') {
        this.parsedOptions.forEach(opt => {
          text += `${opt.key}. ${opt.text}\n`
        })
      }
      navigator.clipboard.writeText(text).then(() => {
        this.copied = true
        setTimeout(() => (this.copied = false), 1500)
      })
    }
  }
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
}

.dialog-box {
  background: white;
  border-radius: 15px;
  min-width: 800px;
  max-width: 1000px;
  width: 60%;
  position: relative;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}

.dialog-content{
  padding-right: 8px;
  margin-right: 8px;
  margin-top: 5px;
  margin-left: 20px;
  margin-bottom: 15px;
  overflow-y: auto;
}

.dialog-content::-webkit-scrollbar {
  width: 8px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background-color: #2196f3;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background-color: #1d81d1;
}

.dialog-content::-webkit-scrollbar-thumb:active {
  background-color: #1b73ba;
}

.dialog-header {
  padding: 20px;
  padding-bottom: 0;
  background: rgba(255, 255, 255, 0);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-box h2 {
  margin-top: 0;
}

.header-title {
  display: flex;
  margin-bottom: 5px;
  align-items: center;

  gap: 10px;
}

.difficulty-tag {
  padding: 4px 10px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
}

.diff-easy {
  background-color: #4CAF50;
}

.diff-medium {
  background-color: #FF9800;
}

.diff-hard {
  background-color: #F44336;
}

.copy-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.copy-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  user-select: none;
  -webkit-user-drag: none;
}

.copy-icon:hover {
  transform: scale(1.2);
}
.copy-icon:active {
  transform: scale(0.95);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-color: red;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.51);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.close-button:hover {
  transform: scale(1.3);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.28);
}
.close-button:active {
  transform: scale(0.95);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.51);
}
</style>