<template>
  <div class="dialog-overlay">
    <div class="dialog-box large">
      <div class="dialog-header">
        <h2 class="header-title">编辑 JSON 格式</h2>
        <div class="close-button" data-tooltip-left="关闭" @click="$emit('close')"></div>
      </div>
      <div class="dialog-content">
        <textarea
            v-model="editable"
            class="json-editor"
            spellcheck="false"
            maxlength="1000"
            placeholder="请输入内容，最大长度 1000 字符。"
        ></textarea>
        <div class="char-counter">{{ charCount }}/1000</div>
      </div>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="$emit('close')">取消</button>
        <button class="format-btn" @click="formatJson">格式化显示缩进</button>

        <button class="confirm-btn" @click="submit">保存修改</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionFormatEditDialog',
  props: {
    text: String
  },
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
    submit() {
      this.$emit('changeText', this.editable);
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