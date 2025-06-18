<template>
  <div class="dialog-overlay">
    <div class="dialog-box">
      <div class="dialog-header">
        <h2 class="header-title">添加题目</h2>
        <div class="close-button" @click="$emit('close')"></div>
      </div>

      <div class="dialog-content" style="margin-bottom: 0">
        <!-- 第一行 -->
        <div class="form-row">
          <label><span class="required">*</span>题型:</label>
          <select v-model="form.type">
            <option value="SINGLE_CHOICE">单选题</option>
            <option value="MULTIPLE_CHOICE">多选题</option>
            <option value="PROGRAMMING">编程题</option>
          </select>

          <label>考点:</label>
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

          <label>难度:</label>
          <select v-model="form.difficulty">
            <option value="EASY">简单</option>
            <option value="MEDIUM">中等</option>
            <option value="HARD">困难</option>
          </select>
        </div>

        <!-- 标题 -->
        <div class="form-row column">
          <label><span class="required">*</span>标题</label>
          <textarea
              v-model="form.content"
              placeholder="请输入标题"
              maxlength="500"
              rows="7"
          ></textarea>
          <div class="char-count">{{ form.content.length }}/500</div>
        </div>

        <!-- 选项和答案（仅限选择题） -->
        <div v-if="isChoiceType" class="form-row column">
          <label><span class="required">*</span>选项</label>
          <div v-for="key in ['A','B','C','D']" :key="key" class="form-row">
            <label style="width: 10px">{{ key }}</label>
            <input class="input-add" v-model="form.options[key]" placeholder="请输入选项内容" maxlength="500" />
          </div>

          <!-- 单选题答案 -->
          <div v-if="form.type === 'SINGLE_CHOICE'" class="form-row">
            <label><span class="required">*</span>答案：</label>
            <div class="answer-select">
              <label  v-for="key in ['A','B','C','D']" :key="key">
                <input
                  type="radio"
                  name="answer"
                  :value="key"
                  v-model="form.answer"
                /> {{ key }}
              </label>
            </div>
          </div>

          <!-- 多选题答案 -->
          <div v-else-if="form.type === 'MULTIPLE_CHOICE'" class="form-row">
            <label><span class="required">*</span>答案：</label>
            <div class="answer-select">
              <label v-for="key in ['A','B','C','D']" :key="key">
                <input
                  type="checkbox"
                  :value="key"
                  v-model="form.answer"
                  style="width: 12px"
                /> {{ key }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="dialog-footer">
        <button class="cancel" @click="$emit('close')">取消</button>
        <button class="confirm" @click="submit">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import './DialogCSS.css';
import './EditCSS.css';
import './TagCSS.css';
export default {
  name: 'QuestionSelfAddDialog',
  data() {
    return {
      form: {
        type: 'SINGLE_CHOICE',
        content: '',
        options: { A: '', B: '', C: '', D: '' },
        answer: [],
        difficulty: 'EASY',
      },
      languageTags: [],
      newTag: '',
    }
  },
  computed: {
    isChoiceType() {
      return this.form.type === 'SINGLE_CHOICE' || this.form.type === 'MULTIPLE_CHOICE'
    }
  },
  methods: {
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
    async submit() {
      if (!this.form.type || !this.form.content.trim()) {
        this.$emit('info', '题型和标题不能为空','warning')
        return
      }
      if (this.isChoiceType) {
        for (let k of ['A','B','C','D']) {
          if (!this.form.options[k].trim()) {
            this.$emit('info', `选项 ${k} 不能为空`, 'warning')
            return
          }
        }
      }

      const payload = {
        type: this.form.type,
        content: this.form.content,
        difficulty: this.form.difficulty,
        language: this.languageTags.join(',')
      }

      if (this.isChoiceType) {
        payload.options = JSON.stringify(this.form.options)
        if (this.form.type === 'MULTIPLE_CHOICE') {
          if (this.form.answer.length < 2) {
            this.$emit('info', '多选题至少选择两个答案', 'warning')
            return
          }
          payload.answer = this.form.answer.sort().join(',')
        } else {
          if (!this.form.answer) {
            this.$emit('info', '请选择答案', 'warning')
            return
          }
          payload.answer = this.form.answer
        }
      }

      try {
        const res = await axios.post('/api/questions', payload)
        if (res.data.success) {
          this.$emit('created')
        } else {
          this.$emit('info', res.data.message || '提交失败', 'error')
        }
      } catch (e) {
        console.error('提交失败', e)
        this.$emit('info', '提交失败，请稍后重试', 'error')
      }
    }
  }
}
</script>
