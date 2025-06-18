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
                placeholder="请输入样例题目以引导AI生成相似题目，您可以在题库中复制题目。"
                maxlength="700"
                rows="8"
            ></textarea>
            <div class="char-count">{{ form.example.length }}/700</div>
          </div>

          <!-- 深度思考 -->
          <div class="form-row">
            <button
              :class="['deep-think-btn', { active: useDeepThinking }]"
              @click="useDeepThinking = !useDeepThinking"
              type="button"
              data-tooltip="使用深度思考"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  class="deep-icon"
              >
                <path d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86zm13.631-4.399c-.187-.488-.429-.988-.71-1.492l-.075-.132-.092.12a22.075 22.075 0 0 1-3.968 3.968l-.12.093.132.074c1.308.734 2.559 1.162 3.556 1.162.563 0 1.006-.138 1.298-.43.3-.3.436-.774.428-1.346-.008-.575-.159-1.264-.449-2.017zm-6.345 1.65l.058.042.058-.042a19.881 19.881 0 0 0 4.551-4.537l.043-.058-.043-.058a20.123 20.123 0 0 0-2.093-2.458 19.732 19.732 0 0 0-2.458-2.08L10 5.364l-.058.042A19.883 19.883 0 0 0 5.39 9.942L5.348 10l.042.059c.631.874 1.332 1.695 2.094 2.457a19.74 19.74 0 0 0 2.458 2.08zm6.366-10.902c-.293-.293-.736-.431-1.298-.431-.998 0-2.248.429-3.556 1.163l-.132.074.12.092a21.938 21.938 0 0 1 3.968 3.968l.092.12.074-.132c.282-.504.524-1.004.711-1.492.29-.753.442-1.442.45-2.017.007-.572-.129-1.045-.429-1.345zM3.712 7.055c.202.514.44 1.013.712 1.493l.074.13.092-.119a21.94 21.94 0 0 1 3.968-3.968l.12-.092-.132-.074C7.238 3.69 5.987 3.262 4.99 3.262c-.563 0-1.006.138-1.298.43-.3.301-.436.774-.428 1.346.007.575.159 1.264.448 2.017zm0 5.89c-.29.753-.44 1.442-.448 2.017-.008.572.127 1.045.428 1.345.293.293.736.431 1.298.431.997 0 2.247-.428 3.556-1.162l.131-.074-.12-.093a21.94 21.94 0 0 1-3.967-3.968l-.093-.12-.074.132a11.712 11.712 0 0 0-.71 1.492z" fill="currentColor" stroke="currentColor" stroke-width=".1"></path>
                <path d="M10.706 11.704A1.843 1.843 0 0 1 8.155 10a1.845 1.845 0 1 1 2.551 1.704z" fill="currentColor" stroke="currentColor" stroke-width=".2"></path>
              </svg>
              深度思考(R1)
            </button>
          </div>


          <!-- 按钮 -->
          <div class="form-row button-group">
            <button class="confirm" @click="handleGenerate" style="margin-left: 10px" :disabled="isCurrentGenerating">生成</button>
          </div>
          <div class="form-row button-group">
            <button class="confirm" @click="handleStop" style="margin-left: 10px">结束</button>
          </div>
        </div>

        <div class="right-panel">
          <div class="ai-response-placeholder">
            <div v-if="questions.length === 0 && !isCurrentGenerating" class="empty-placeholder">AI题目生成区</div>
            <div
              class="chat-bubble"
              v-for="(q, index) in questions"
              :key="index"
            >
              <div class="bubble-top">
                <div class="bubble-top-row">
                  <div class="model-info">
                    <span class="ai-label">{{ q.isDeepThinking ? 'DeepSeek-R1' : 'DeepSeek-V3' }}</span>
                    <span v-if="q.isDeepThinking" class="deep-tag">
                      <img src="@/assets/icons/deepseek.svg" class="deep-icon-inline" />
                      已深度思考：用时{{ q.useTime }}秒
                    </span>
                  </div>
                  <div class="right-controls">
                    <button v-if="q.isDeepThinking" class="collapse-btn" @click="toggleCollapse(index)">
                      {{ q.collapsedDeepThinking ? '展开深度思考' : '折叠深度思考' }}
                    </button>
                    <div class="create-time">{{ q.creatTime }}</div>
                  </div>
                </div>
                <div class="divider"></div>
                <div class="ai-response deepthink-response" v-show="!q.collapsedDeepThinking">{{ q.deepThinkingResponse }}</div>
                <div v-show="!q.collapsedDeepThinking && q.isDeepThinking" class="divider"></div>
                <div class="ai-response">{{ q.chatResponse }}</div>
                <div class="divider"></div>
              </div>
              <div class="bubble-bottom">
                <div class="param"><strong>题型:</strong> {{ q.type === 'SINGLE_CHOICE' ? '单选题' : q.type === 'MULTIPLE_CHOICE' ? '多选题' : '编程题' }}</div>
                <div class="param">
                  <strong>难度:</strong>
                  <span
                    :class="[
                      'difficulty-label',
                      q.difficulty === 'EASY' ? 'difficulty-easy' :
                      q.difficulty === 'MEDIUM' ? 'difficulty-medium' : 'difficulty-hard'
                    ]"
                  >
                    {{ q.difficulty === 'EASY' ? '简单' : q.difficulty === 'MEDIUM' ? '中等' : '困难' }}
                  </span>
                </div>
                <div class="param" v-if="q.language">
                  <strong>考点:</strong>
                  <span
                    class="tag-label"
                    v-for="(tag, idx) in q.language.split(',')"
                    :key="idx"
                  >
                    {{ tag }}
                  </span>
                </div>
                <div class="param" v-if="q.discribe"><strong>描述:</strong> {{ q.discribe }}</div>
                <div class="param" v-if="q.example"><strong>样例:</strong> {{ q.example }}</div>
                <div class="bubble-actions">
                  <button class="action-btn preview-btn" @click="previewQuestion(index)">预览</button>
                  <button class="action-btn delete-btn" @click="confirmDelete(index)">删除</button>
                </div>
              </div>
            </div>
            <!-- 正在生成气泡 -->
            <div v-if="isCurrentGenerating" class="chat-bubble generating-bubble">
              <div class="bubble-top">
                <div class="bubble-top-row">
                  <div class="model-info">
                    <span class="ai-label">{{ currentGeneratingQuestion.isDeepThinking ? 'DeepSeek-R1' : 'DeepSeek-V3' }}</span>
                    <span class="deep-tag">
                      {{ currentGeneratingQuestion.isDeepThinking ? '正在深度思考' : '正在思考' }}
                      <span class="spinner"></span>
                    </span>
                  </div>
                  <div class="create-time">生成中...</div>
                </div>
                <div class="divider"></div>
                <div class="ai-response deepthink-response" v-if="currentGeneratingQuestion.isDeepThinking">{{ currentGeneratingQuestion.deepThinkingResponse }}</div>
                <div v-if="currentGeneratingQuestion.isDeepThinking" class="divider"></div>
                <div class="ai-response">{{ currentGeneratingQuestion.chatResponse }}</div>
                <div class="divider"></div>
              </div>
              <div class="bubble-bottom">
                <div class="param"><strong>题型:</strong> {{ currentGeneratingQuestion.type === 'SINGLE_CHOICE' ? '单选题' : currentGeneratingQuestion.type === 'MULTIPLE_CHOICE' ? '多选题' : '编程题' }}</div>
                <div class="param">
                  <strong>难度:</strong>
                  <span
                    :class="[
                      'difficulty-label',
                      currentGeneratingQuestion.difficulty === 'EASY' ? 'difficulty-easy' :
                      currentGeneratingQuestion.difficulty === 'MEDIUM' ? 'difficulty-medium' : 'difficulty-hard'
                    ]"
                  >
                    {{ currentGeneratingQuestion.difficulty === 'EASY' ? '简单' : currentGeneratingQuestion.difficulty === 'MEDIUM' ? '中等' : '困难' }}
                  </span>
                </div>
                <div class="param" v-if="currentGeneratingQuestion.language">
                  <strong>考点:</strong>
                  <span
                    class="tag-label"
                    v-for="(tag, idx) in currentGeneratingQuestion.language.split(',')"
                    :key="idx"
                  >
                    {{ tag }}
                  </span>
                </div>
                <div class="param" v-if="currentGeneratingQuestion.discribe"><strong>描述:</strong> {{ currentGeneratingQuestion.discribe }}</div>
                <div class="param" v-if="currentGeneratingQuestion.example"><strong>样例:</strong> {{ currentGeneratingQuestion.example }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade-dialog">
      <QuestionAIEditDialog
          v-if="showEditAiGenerateDialog"
          :question="currentEditAIQuestion"
          @close="showEditAiGenerateDialog = false"
          @info="showToast"
          @created="handleCreatedQuestion"
      />
    </transition>
  </div>
</template>

<script>
import './DialogCSS.css'
import './EditCSS.css'
import QuestionAIEditDialog from "@/components/QuestionDialog/QuestionAIEditDialog.vue";
// import {quizPrompt} from "@/utils/QuizPrompt";

export default {
  name: 'QuestionAIAddDialog',
  components: {
    QuestionAIEditDialog
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
      newTag: '',
      useDeepThinking: false,
      showEditAiGenerateDialog: false,
      currentEditAIQuestion: null,
      currentGeneratingQuestion: {
        type: "",
        difficulty: "",
        language: "",
        discribe: "",
        example: "",
        isDeepThinking: false,
        deepThinkingResponse: "",
        chatResponse: "",
        creatTime: "",
      },
      isCurrentGenerating: false,
      startTime: null,
      questions:[
        // {
        //   //用户输入
        //   type: "MULTIPLE_CHOICE",
        //   difficulty: "MEDIUM",
        //   language: "",
        //   discribe: "",
        //   example: "",
        //   //AI生成
        //   isDeepThinking: true,
        //   deepThinkingResponse: "这是深度思考的结果",
        //   chatResponse: '{"content": "以下哪些是计算机网络的基本组成部分？", "options": {"A":"服务器","B":"客户端","C":"网络设备","D":"发电机"}, "answer": "A,B,C"}',
        //   //其他参数
        //   creatTime: "2023-10-01 11:00:00",
        //   useTime:24,//深度思考时间
        //   collapsedDeepThinking: false,
        // },
        // {
        //   //用户输入
        //   type: "SINGLE_CHOICE",
        //   difficulty: "EASY",
        //   language: "java,go,c",
        //   discribe: "这是一段描述",
        //   example: "设置一个例子",
        //   //AI生成
        //   isDeepThinking: false,
        //   deepThinkingResponse: "",
        //   chatResponse: '{"content": "以下哪个选项是计算机网络的基本组成部分？", "options": {"A":"服务器","B":"客户端","C":"网络设备","D":"以上都是"}, "answer": "D"}',
        //   //其他参数
        //   creatTime: "2023-10-01 12:00:00",
        //   useTime:0,
        //   collapsedDeepThinking: false,
        // },
        // {
        //   //用户输入
        //   type: "MULTIPLE_CHOICE",
        //   difficulty: "EASY",
        //   language: "java,go,c",
        //   discribe: "这是一段描述",
        //   example: "设置一个例子",
        //   //AI生成
        //   isDeepThinking: false,
        //   deepThinkingResponse: "",
        //   chatResponse: '{"content": "以下哪些是计算机网络的基本组成部分？", "options": {"A":"服务器","B":"客户端","C":"网络设备","D":"发电机"}, "answer": "A,B,C"}',
        //   //其他参数
        //   creatTime: "2023-10-01 12:00:00",
        //   useTime:0,
        //   collapsedDeepThinking: false,
        // },
        // {
        //   //用户输入
        //   type: "PROGRAMMING",
        //   difficulty: "HARD",
        //   language: "java,go,c",
        //   discribe: "这是一段描述",
        //   example: "设置一个例子",
        //   //AI生成
        //   isDeepThinking: false,
        //   deepThinkingResponse: "",
        //   chatResponse: '{"content": "请编写一个函数，计算两个数的和。"}',
        //   //其他参数
        //   creatTime: "2023-10-01 12:00:00",
        //   useTime:0,
        //   collapsedDeepThinking: false,
        // },
        // {
        //   //用户输入
        //   type: "PROGRAMMING",
        //   difficulty: "HARD",
        //   language: "java,go,c",
        //   discribe: "这是一段描述",
        //   example: "设置一个例子",
        //   //AI生成
        //   isDeepThinking: false,
        //   deepThinkingResponse: "",
        //   chatResponse: '{"content": "请编写一个函数，计算两个数的和。"',
        //   //其他参数
        //   creatTime: "2023-10-01 12:00:00",
        //   useTime:0,
        //   collapsedDeepThinking: false,
        // }
      ]
    }
  },
  methods: {
    handleGenerate() {
      if (!this.form.type || !this.form.difficulty) {
        this.$emit('info', '题型与难度为必填项', 'warning')
        return
      }
      this.currentGeneratingQuestion = {
        ...this.form,
        language: this.languageTags.join(','),
        isDeepThinking: this.useDeepThinking,
        deepThinkingResponse: this.useDeepThinking ? '这是深度思考的结果' : '',
        chatResponse: '{"content": "以下哪些是计算机网络的基本组成部分？", "options": {"A":"服务器","B":"客户端","C":"网络设备","D":"发电机"}, "answer": "A,B,C"}',
        creatTime: new Date().toLocaleString(),
      }
      this.startTime = Date.now()
      this.isCurrentGenerating = true
      // this.scrollToBottom();
    },
    handleStop() {
      if (this.isCurrentGenerating) {
        const endTime = Date.now()
        const useTime = this.currentGeneratingQuestion.isDeepThinking
          ? Math.floor((endTime - this.startTime) / 1000)
          : 0

        this.questions.push({
          ...this.currentGeneratingQuestion,
          useTime,
          collapsedDeepThinking: false
        })

        this.isCurrentGenerating = false
        this.$emit('info', '生成已结束', 'success')
      }
      this.scrollToBottom();
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
    toggleCollapse(index) {
      this.questions[index].collapsedDeepThinking = !this.questions[index].collapsedDeepThinking;
    },
    confirmDelete(index) {
      if (confirm('确定要删除这道题目吗？')) {
        this.questions.splice(index, 1);
        this.$emit('info', '删除成功', 'success');
      }
    },
    showToast(message, type = 'success') {
      this.$emit('info',message, type)
    },
    handleCreatedQuestion() {
      this.showEditAiGenerateDialog = false
      this.$emit('info','创建成功', 'success')
      this.$emit('search')
    },
    previewQuestion(index) {
      const q = this.questions[index];
      let parsed;
      try {
        parsed = JSON.parse(q.chatResponse);
      } catch (e) {
        this.$emit('info', '抱歉，生成结果不佳，请删除重试', 'warning');
        return;
      }
      this.currentEditAIQuestion = {
        type: q.type,
        content: parsed.content || '',
        difficulty: q.difficulty,
        options: parsed.options || null,
        language: q.language || '',
        answer: parsed.answer || '',
      };
      this.showEditAiGenerateDialog = true;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const panel = this.$el.querySelector('.right-panel');
        if (panel) {
          panel.scrollTop = panel.scrollHeight;
        }
      });
    }
  }
}
</script>

<style scoped>
.dialog-box-ai {
  display: flex;
  flex-direction: column;
  height: 90vh;
  min-width: 1300px;
  min-height: 780px;
}

.dialog-content-h {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left-panel {
  margin-top: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: 100%;
}

.right-panel {
  flex: 2;
  min-width: 0;
  height: 95%;
  background: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 10px;
  padding: 12px;
  margin-left: 12px;
  overflow-y: auto;
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

.deep-think-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 14px;
  border-radius: 15px;
  background-color: rgba(230, 229, 229, 0.66);
  border: 1px solid #ccc;
  color: #333;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  margin-left: 10px;
}
.deep-think-btn.active {
  background-color: #4aa6ef;
  color: white;
}
.deep-think-btn:hover{
  transform: scale(1.05);
}

.deep-think-btn:active{
  transform: scale(0.99);
}
.deep-icon {
  width: 20px;
  height: 20px;
}

/* 通用 tooltip 样式 */
[data-tooltip] {
  position: relative;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  z-index: 1000;
}

/* 悬停时显示 */
[data-tooltip]:hover::after {
  visibility: visible;
  opacity: 1;
}


.chat-bubble {
  width: 96%;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-bottom: 2px solid #4aa6ef;
}

.bubble-top {
  margin-bottom: 6px;
}

.bubble-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-info {
  display: flex;
  text-align: center;
  align-items: center;
  gap: 10px;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  background: transparent;
  border: 1px solid #4aa6ef;
  color: #4aa6ef;
  padding: 2px 8px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.collapse-btn:hover {
  background: #4aa6ef;
  color: white;
}

.deep-tag {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  line-height: 1;
  margin: 0;
}

.deep-icon-inline {
  width: 15px;
  height: 15px;
}

.create-time {
  font-size: 12px;
  color: #999;
}

.ai-label {
  font-weight: bold;
  color: #4aa6ef;
  line-height: 1;
  margin: 0;
}

.ai-response {
  white-space: pre-wrap;
  line-height: 1.4;
  padding: 2px 0;
}

.deepthink-response{
  color: #838383;
}

.divider {
  height: 2px;
  margin: 10px 0;
  background: linear-gradient(to right, transparent, #4aa6ef, transparent);
  border-radius: 2px;
}

.bubble-bottom .param {
  font-size: 14px;
  color: #333;
  margin-top: 2px;
}

.tag-label {
  display: inline-block;
  background-color: #e6f0ff;
  color: #4aa6ef;
  font-size: 13px;
  padding: 0px 8px;
  padding-bottom: 3px;
  border-radius: 8px;
  margin-left: 6px;
  margin-bottom: 0;
}

.difficulty-label {
  display: inline-block;
  border-radius: 8px;
  padding: 1px 8px;
  font-size: 13px;
  color: white;
  margin-left: 6px;
  user-select: none;
  vertical-align: middle;
}

.difficulty-easy {
  background-color: #52c41a;
}

.difficulty-medium {
  background-color: #fa8c16;
}

.difficulty-hard {
  background-color: #f5222d;
}

.bubble-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.action-btn {
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.preview-btn {
  background-color: #eee;
  color: #333;
}

.preview-btn:hover {
  background-color: #d9d9d9;
}

.delete-btn {
  background-color: #f5222d;
  color: white;
}
.delete-btn:hover {
  background-color: #c41d1d;
}

.fade-dialog-enter-active,
.fade-dialog-leave-active {
  transition: opacity 0.3s ease;
}

.fade-dialog-enter-from,
.fade-dialog-leave-to {
  opacity: 0;
}

.fade-dialog-enter-to,
.fade-dialog-leave-from {
  opacity: 1;
}

.empty-placeholder {
  text-align: center;
  font-size: 50px;
  color: #999;
  margin-top: 40%;
}

.generating-bubble {
  background-color: #fff3e5;
}
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #4aa6ef;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: 6px;
}
@keyframes spin {
  to {
    transform: rotate(720deg);
  }
}
</style>
