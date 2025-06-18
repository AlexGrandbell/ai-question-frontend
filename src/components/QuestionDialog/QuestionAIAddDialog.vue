<template>
  <div class="dialog-overlay">
    <div class="dialog-box-ai">
      <!-- 顶部栏 -->
      <div class="dialog-header">
        <h2 class="header-title">AI出题</h2>
        <div class="close-button" @click="$emit('close')"></div>
      </div>

      <!-- 主体部分，左右结构 -->
      <div class="dialog-content-h">
        <!-- 左侧参数控制区 -->
        <div class="left-panel">
          <!-- 题型选择 -->
          <div class="form-row">
            <label><span class="required">*</span>题型:</label>
            <select v-model="form.type">
              <option disabled value="">请选择</option>
              <option value="SINGLE_CHOICE">单选题</option>
              <option value="MULTIPLE_CHOICE">多选题</option>
              <option value="PROGRAMMING">编程题</option>
            </select>
          </div>

          <!-- 难度 -->
          <div class="form-row">
            <label><span class="required">*</span>难度:</label>
            <select v-model="form.difficulty">
              <option value="EASY">简单</option>
              <option value="MEDIUM">中等</option>
              <option value="HARD">困难</option>
            </select>
          </div>

          <!-- 考点标签 -->
          <div class="form-row column" >
            <label>考点：</label>
            <div class="tag-input-container">
              <div class="tag" v-for="(tag, index) in languageTags" :key="index">
                {{ tag }}
                <span class="remove-tag" @click="removeTag(index)">×</span>
              </div>
              <input v-if="languageTags.length < 5"
                     class="input-tag tag-input"
                     type="text"
                     v-model="newTag"
                     @keyup.enter="addTag"
                     :placeholder="`剩余 ${5 - languageTags.length} 个，回车添加`"
              />
            </div>
          </div>

          <!-- 描述题目 -->
          <div class="form-row column" style="margin-bottom: 0">
            <label>描述：</label>
            <textarea
                v-model="form.discribe"
                placeholder="请输入描述使AI更好地向您想的方向出题"
                maxlength="300"
                rows="5"
            ></textarea>
            <div class="char-count">{{ form.discribe.length }}/300</div>
          </div>

          <!-- 样例题目 -->
          <div class="form-row column">
            <label>样例：</label>
            <textarea
                v-model="form.example"
                placeholder="请输入样例题目以引导AI生成相似题目"
                maxlength="700"
                rows="8"
            ></textarea>
            <div class="char-count">{{ form.example.length }}/700</div>
          </div>

          <!-- 按钮 -->
          <div class="form-row button-group">
            <button class="confirm" @click="handleGenerate">生成</button>
            <button :disabled="!generated" class="cancel">预览</button>
          </div>
        </div>

        <!-- 右侧预留回答区（暂不实现） -->
        <div class="right-panel">
          <!-- AI 回答区域 -->
          <div class="ai-response-placeholder">
            <p>（AI回答区域暂未实现）</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './DialogCSS.css'
import './EditCSS.css'
export default {
  name: 'QuestionAIAddDialog',
  components: {

  },
  data() {
    return {
      form: {
        type: 'SINGLE_CHOICE',
        difficulty: 'EASY',
        discribe:'',
        example: ''
      },
      languageTags: [],
      generated: false,
      newTag: '',
    }
  },
  methods: {
    handleGenerate() {
      if (!this.form.type || !this.form.difficulty) {
        this.$emit('info', '题型与难度为必填项', 'warning')
        return
      }
      this.generated = true
      this.$emit('info', '模拟生成成功（尚未实现）', 'success')
    },
    addTag() {
      const tag = this.newTag.trim();
      if (!tag) {
        this.newTag = '';
        return;
      }
      if (tag.includes(',')) {
        this.$emit('info', '不能包含英文逗号', 'warning');
        this.newTag = '';
        return;
      }
      if (tag.length > 10) {
        this.$emit('info', '每个标签最多 10 个字符', 'warning');
        this.newTag = '';
        return;
      }
      if (this.languageTags.includes(tag)) {
        this.$emit('info', '标签已存在', 'warning');
        this.newTag = '';
        return;
      }
      if (this.languageTags.length >= 5) {
        this.$emit('info', '最多添加 5 个考点标签', 'warning');
        this.newTag = '';
        return;
      }
      this.languageTags.push(tag);
      this.newTag = '';
    },
    removeTag(index) {
      this.languageTags.splice(index, 1);
    },
  }
}
</script>

<style scoped>
.dialog-box-ai {
  height: 90vh;
}
.left-panel {
  margin-top: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.right-panel {
  flex: 2;
  background: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}

.button-group {
  margin-top: auto;
  display: flex;
  gap: 12px;
}

button.secondary {
  background-color: #eee;
  color: #333;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>