<template>
  <div class="dialog-overlay">
    <div class="dialog-box large">
      <div class="dialog-header">
        <h2 class="header-title">快速出题</h2>
        <div class="close-button" data-tooltip-left="关闭" @click="$emit('close')"></div>
      </div>
      <div class="dialog-content">
        <textarea
            v-model="editable"
            class="json-editor"
            spellcheck="false"
            maxlength="1000"
            placeholder='请按照以下格式输入题目内容：
{
  "type": "SINGLE_CHOICE", // 题目类型，必选。仅可选择 SINGLE_CHOICE、MULTIPLE_CHOICE 或 PROGRAMMING
  "content": "题干内容",    // 题干内容，必选
  "options": { "A": "选项A", "B": "选项B", "C": "选项C", "D": "选项D" }, // 选项内容，仅在单选/多选题中必选
  "answer": "A",           // 单选/多选题必选。若为多选题则为逗号分隔的字符串，如 "A,B,C"
  "difficulty": "EASY",    // 难度，必选。必须是 EASY、MEDIUM 或 HARD
  "language": "考点1,考点2" // 考点标签，可选。逗号分隔，最多 5 个标签
}
最大长度 1000 字符。'
        ></textarea>
        <div class="char-counter">{{ charCount }}/1000</div>
      </div>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="$emit('close')">取消</button>
        <button class="format-btn" @click="formatJson">格式化显示缩进</button>
        <button class="format-btn" @click="checkFormat">检查格式</button>
        <button class="confirm-btn" @click="submit">出题</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getUserInfo } from '@/utils/auth';
export default {
  name: 'QuestionFastDialog',
  data() {
    return {
      editable: this.text || ''
    }
  },
  computed: {
    charCount() {
      return this.editable.length;
    }
  },
  methods: {
    checkFormat() {
      let parsed;
      try {
        parsed = JSON.parse(this.editable);
      } catch (e) {
        this.$emit('info', 'JSON 格式不正确，请检查语法', 'warning');
        return false;
      }

      const { type, content, options, answer, difficulty, language } = parsed;
      const validTypes = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'PROGRAMMING'];
      const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
      const optionKeys = ['A', 'B', 'C', 'D'];

      if (!type || !validTypes.includes(type)) {
        this.$emit('info', 'type 字段必须是 SINGLE_CHOICE、MULTIPLE_CHOICE 或 PROGRAMMING', 'warning');
        return false;
      }
      if (!content || typeof content !== 'string') {
        this.$emit('info', 'content 字段必须是非空字符串', 'warning');
        return false;
      }
      if (!difficulty || typeof difficulty !== 'string') {
        this.$emit('info', 'difficulty 字段是必填字段，且必须是 EASY, MEDIUM 或 HARD', 'warning');
        return false;
      }

      const isChoice = type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE';
      if (isChoice) {
        if (!options || typeof options !== 'object') {
          this.$emit('info', 'options 字段必须是对象，包含 A-D 四个非空选项', 'warning');
          return false;
        }
        for (let key of optionKeys) {
          if (!options[key] || typeof options[key] !== 'string' || !options[key].trim()) {
            this.$emit('info', `选项 ${key} 不能为空`, 'warning');
            return false;
          }
        }
        const optionActualKeys = Object.keys(options);
        const expectedOrder = ['A', 'B', 'C', 'D'];
        const hasDuplicateKeys = optionActualKeys.length !== new Set(optionActualKeys).size;

        if (hasDuplicateKeys) {
          this.$emit('info', 'options 中存在重复键，JSON 不合法，可能键名重复，如 "D" 被覆盖', 'warning');
          return false;
        }
        if (optionActualKeys.length !== 4 || JSON.stringify(optionActualKeys) !== JSON.stringify(expectedOrder)) {
          this.$emit('info', 'options 字段必须严格包含唯一的 A、B、C、D 四个选项，且顺序一致', 'warning');
          return false;
        }

        if (!answer) {
          this.$emit('info', 'answer 字段必须存在', 'warning');
          return false;
        }

        if (type === 'SINGLE_CHOICE') {
          if (typeof answer !== 'string' || !optionKeys.includes(answer)) {
            this.$emit('info', '单选题 answer 必须是 A~D 中的一个字符', 'warning');
            return false;
          }
        } else if (type === 'MULTIPLE_CHOICE') {
          const answers = typeof answer === 'string' ? answer.split(',') : [];
          const uniqueAnswers = [...new Set(answers)];
          if (
            uniqueAnswers.length < 2 || uniqueAnswers.length > 4 ||
            !uniqueAnswers.every(a => optionKeys.includes(a))
          ) {
            this.$emit('info', '多选题 answer 必须是不重复的 A~D 字符，逗号分隔，至少两个不多于四个', 'warning');
            return false;
          }
        }
      }

      if (difficulty && !validDifficulties.includes(difficulty)) {
        this.$emit('info', 'difficulty 可选，但若填写必须是 EASY、MEDIUM 或 HARD', 'warning');
        return false;
      }

      if (language) {
        if (typeof language !== 'string') {
          this.$emit('info', 'language 必须是字符串', 'warning');
          return false;
        }
        const tags = language.split(',').map(tag => tag.trim()).filter(Boolean);
        if (tags.length > 5) {
          this.$emit('info', 'language 最多包含 5 个标签', 'warning');
          return false;
        }
      }

      this.$emit('info', '格式检查通过', 'success');
      return true;
    },
    async submit() {
      if (!this.checkFormat()) return;

      let parsed;
      try {
        parsed = JSON.parse(this.editable);
      } catch (e) {
        this.$emit('info', 'JSON 格式不正确，请检查语法', 'warning');
        return;
      }

      const requiredFields = ['type', 'content', 'difficulty'];
      for (const field of requiredFields) {
        if (!parsed[field]) {
          this.$emit('info', `缺少必要字段: ${field}`, 'warning');
          return;
        }
      }

      const type = parsed.type;
      const isChoice = type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE';

      if (isChoice) {
        if (typeof parsed.options !== 'object' || parsed.options === null) {
          this.$emit('info', '选择题需包含 options 对象', 'warning');
          return;
        }
        if (!parsed.answer) {
          this.$emit('info', '请选择答案', 'warning');
          return;
        }
        // answer 类型检查
        if (
          (type === 'SINGLE_CHOICE' && typeof parsed.answer !== 'string') ||
          (type === 'MULTIPLE_CHOICE' && !Array.isArray(parsed.answer) && typeof parsed.answer !== 'string')
        ) {
          this.$emit('info', '选择题答案格式不正确', 'warning');
          return;
        }
      }

      const user = getUserInfo();
      const payload = {
        userId: user.id,
        type: parsed.type,
        content: parsed.content,
        difficulty: parsed.difficulty,
        language: parsed.language || '',
        options: isChoice ? JSON.stringify(parsed.options) : undefined,
        answer: parsed.answer
      };

      if (isChoice && type === 'MULTIPLE_CHOICE') {
        if (Array.isArray(payload.answer)) {
          payload.answer = [...new Set(payload.answer)].sort().join(',');
        } else if (typeof payload.answer === 'string') {
          payload.answer = [...new Set(payload.answer.split(','))].sort().join(',');
        }
      }

      try {
        const res = await axios.post('/api/questions', payload);
        if (res.data && res.data.success) {
          this.$emit('created');
        } else {
          this.$emit('info', (res.data && res.data.message) || '提交失败', 'error');
        }
      } catch (e) {
        console.error('提交失败', e);
        this.$emit('info', '提交失败，请稍后重试', 'error');
      }
    },
    formatJson() {
      try {
        const parsed = JSON.parse(this.editable);
        this.editable = JSON.stringify(parsed, null, 2);
        this.$emit('info', '格式化成功','success');
      } catch (e) {
        this.$emit('info', '无效的 JSON 格式，无法解析','warning');
      }
    }
  }
}
</script>

<style scoped>
.dialog-box.large {
  width: 80vw;
  max-width: 900px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.json-editor {
  width: 100%;
  height: 400px;
  max-height: 50vh;
  min-height: 10vh;
  font-family: monospace;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  box-sizing: border-box;
  background-color: #f8f8f8;
  white-space: pre;
  line-height: 1.5;
}

.char-counter {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.dialog-format {
  display: flex;
  justify-content: flex-start;
  margin-top: 12px;
}

.format-btn {
  padding: 6px 14px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  background-color: rgba(250, 225, 255, 0.95);
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.format-btn:hover {
  background-color: #f1c9ff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  gap: 10px;
}

.cancel-btn,
.confirm-btn {
  padding: 6px 14px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background-color: #eee;
  color: #333;
}

.cancel-btn:hover {
  background-color: #ddd;
}

.confirm-btn {
  background-color: #4aa6ef;
  color: white;
}
.confirm-btn:hover {
  background-color: #3a8acb;
}
</style>