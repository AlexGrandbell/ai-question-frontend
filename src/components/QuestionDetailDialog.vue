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
import './DialogCSS.css';
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
.dialog-box {
  max-height: 80vh;
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
</style>