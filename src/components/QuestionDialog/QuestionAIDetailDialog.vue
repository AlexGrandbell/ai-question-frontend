<template>
  <div class="dialog-overlay">
    <div class="dialog-box" style="max-height: 850px">
      <div class="dialog-header" >
        <h2 class="header-title">与AI交流题目细节</h2>
        <div class="close-button" data-tooltip-left="关闭" @click="$emit('close')"></div>
      </div>

      <div class="dialog-content">
        <div class="chat-info-bar">AI 已查看当前题目</div>
        <div class="chat-window">
            <div
              v-for="(chat, index) in chats"
              :key="index"
              :class="['chat-bubble', chat.role === 'user' ? 'user-bubble' : 'ai-bubble']"
            >
              <div v-if="chat.role === 'user'" style="user-select: text">
                <div style="font-size: 14px; color: #888; text-align: right;">{{ chat.creatTime }}</div>
                <div style="margin: 8px 0; height: 2px; background: linear-gradient(to right, #d0e6ff, #5b9df9);"></div>
                {{ chat.chatResponse }}
              </div>
              <div v-else style="user-select: text">
                <div style="position: relative;">
                  <div style="display: flex; justify-content: space-between; font-size: 12px; color: #888;gap: 10px">
                    <div style="font-size: 14px;display: flex;align-items: center ">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          class="deep-icon"
                          style="padding-bottom: 2px"
                      >
                        <path d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86zm13.631-4.399c-.187-.488-.429-.988-.71-1.492l-.075-.132-.092.12a22.075 22.075 0 0 1-3.968 3.968l-.12.093.132.074c1.308.734 2.559 1.162 3.556 1.162.563 0 1.006-.138 1.298-.43.3-.3.436-.774.428-1.346-.008-.575-.159-1.264-.449-2.017zm-6.345 1.65l.058.042.058-.042a19.881 19.881 0 0 0 4.551-4.537l.043-.058-.043-.058a20.123 20.123 0 0 0-2.093-2.458 19.732 19.732 0 0 0-2.458-2.08L10 5.364l-.058.042A19.883 19.883 0 0 0 5.39 9.942L5.348 10l.042.059c.631.874 1.332 1.695 2.094 2.457a19.74 19.74 0 0 0 2.458 2.08zm6.366-10.902c-.293-.293-.736-.431-1.298-.431-.998 0-2.248.429-3.556 1.163l-.132.074.12.092a21.938 21.938 0 0 1 3.968 3.968l.092.12.074-.132c.282-.504.524-1.004.711-1.492.29-.753.442-1.442.45-2.017.007-.572-.129-1.045-.429-1.345zM3.712 7.055c.202.514.44 1.013.712 1.493l.074.13.092-.119a21.94 21.94 0 0 1 3.968-3.968l.12-.092-.132-.074C7.238 3.69 5.987 3.262 4.99 3.262c-.563 0-1.006.138-1.298.43-.3.301-.436.774-.428 1.346.007.575.159 1.264.448 2.017zm0 5.89c-.29.753-.44 1.442-.448 2.017-.008.572.127 1.045.428 1.345.293.293.736.431 1.298.431.997 0 2.247-.428 3.556-1.162l.131-.074-.12-.093a21.94 21.94 0 0 1-3.967-3.968l-.093-.12-.074.132a11.712 11.712 0 0 0-.71 1.492z" fill="currentColor" stroke="currentColor" stroke-width=".1"></path>
                        <path d="M10.706 11.704A1.843 1.843 0 0 1 8.155 10a1.845 1.845 0 1 1 2.551 1.704z" fill="currentColor" stroke="currentColor" stroke-width=".2"></path>
                      </svg>
                      {{ chat.isDeepThinking ? '已深度思考：用时' + chat.useTime + '秒' : '已思考' }}
                    </div>
                    <div style="font-size: 14px">{{ chat.creatTime }}</div>
                  </div>
                  <div v-if="chat.isDeepThinking">
                    <div style="margin: 8px 0; height: 2px; background: linear-gradient(to right, #5b9df9, #d0e6ff);"></div>
                    <div style="color: gray">{{ chat.deepThinkingResponse }}</div>
                  </div>
                  <div>
                    <div style="margin: 8px 0; height: 2px; background: linear-gradient(to right, #5b9df9, #d0e6ff);"></div>
                    <div class="markdown-content" v-html="renderMarkdown(chat.chatResponse)"></div>
                  </div>
                  <button
                    class="copy-button"
                    @click="copyChat(chat.chatResponse, index)"
                    :data-tooltip="copiedIndex === index ? '已复制' : '复制正文'"
                  >
                    <img
                        :src="copiedIndex === index ? require('@/assets/icons/check.svg') : require('@/assets/icons/copy.svg')"
                        alt="复制"
                        style="width: 20px; height: 20px;"
                    />
                  </button>

                </div>
              </div>
            </div>
          <div v-if="isCurrentGenerating" class="chat-bubble ai-bubble current-bubble">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #888; gap: 10px;">
              <div style="display: flex;font-size: 14px">正在思考中 <span class="spinner"></span></div>
              <div style="font-size: 14px">{{ currentResponse.creatTime }}</div>
            </div>
            <div v-if="currentResponse.isDeepThinking">
              <div style="margin: 8px 0; height: 2px; background: linear-gradient(to right, #5b9df9, #d0e6ff);"></div>
              <div style="color: gray">{{ currentResponse.deepThinkingResponse }}</div>
            </div>
            <div>
              <div style="margin: 8px 0; height: 2px; background: linear-gradient(to right, #5b9df9, #d0e6ff);"></div>
              <div class="markdown-content" v-html="renderMarkdown(currentResponse.chatResponse)"></div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <textarea
            class="input-box"
            placeholder="请输入问题..."
            v-model="userInput"
            :disabled="isCurrentGenerating"
          ></textarea>
          <div class="input-buttons">
            <button
              class="deepthink-btn"
              :class="{ active: useDeepThinking }"
              @click="useDeepThinking = !useDeepThinking"
              :data-tooltip ="useDeepThinking ? '取消深度思考' : '启用深度思考'"
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
              深度思考
            </button>
            <button class="send-btn" @click="handleGenerate" :disabled="isCurrentGenerating">发送</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import './DialogCSS.css'
import './EditCSS.css';
import './TagCSS.css'
import './TooltipCSS.css'
import {detailPrompt} from "@/utils/DetailPrompt";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default {
  name: 'QuestionAIDetailDialog',
  props: {
    question: {
      type: Object,
      required: true,
      default: () => ({
        type: '',
        difficulty: '',
        language: '',
        discribe: '',
        content: ''
      })
    }
  },
  data(){
    return{
      chats:[
        // {
        //   role: 'user',
        //   isDeepThinking: false,
        //   deepThinkingResponse: "",
        //   chatResponse: 'heello worlddworldasddsasdworldasddsasdworldasddsasdworldasddsasd',
        //   //其他参数
        //   creatTime: "2023-10-01 11:00:00",
        //   useTime:24,
        // },
        // {
        //   role: 'assistant',
        //   isDeepThinking: false,
        //   deepThinkingResponse: "这是深度思考的结果",
        //   chatResponse: '```json\n' +
        //       '{\n' +
        //       '    "content": "在JavaScript中，以下关于变量提升(Hoisting)和暂时性死区(Temporal Dead Zone)的描述，哪个是正确的？",\n' +
        //       '    "options": {\n' +
        //       '        "A": "使用let声明的变量存在变量提升，但不会进入暂时性死区",\n' +
        //       '        "B": "使用var声明的变量不存在变量提升，但会进入暂时性死区",\n' +
        //       '        "C": "使用const声明的变量既存在变量提升也会进入暂时性死区",\n' +
        //       '        "D": "函数声明不存在变量提升，但函数表达式会进入暂时性死区"\n' +
        //       '    },\n' +
        //       '    "answer": ""\n' +
        //       '}\n' +
        //       '```',
        //   //其他参数
        //   creatTime: "2023-10-01 11:00:00",
        //   useTime:24,
        // },

      ],
      currentResponse: {
        isDeepThinking: false,
        deepThinkingResponse: " ",
        chatResponse: " ",
        creatTime: "",
        useTime: 0,
      },
      useDeepThinking: false,
      userInput: '',
      isCurrentGenerating: false,
      copiedIndex: null,
    }
  },
  methods:{
    renderMarkdown(text) {
      return DOMPurify.sanitize(marked(text));
    },
    bulidPrompt(){
      let msg = []
      let systemPrompt = detailPrompt.systemPromptHead+detailPrompt.systemPromptTail;
      if (this.question.type === 'SINGLE_CHOICE') {
        systemPrompt += detailPrompt.typeHead.single
      } else if (this.question.type === 'MULTIPLE_CHOICE') {
        systemPrompt += detailPrompt.typeHead.multiple
      } else {
        systemPrompt += detailPrompt.typeHead.programming
      }
      systemPrompt += this.question.content + detailPrompt.tmp;
      if (this.question.difficulty === 'EASY') {
        systemPrompt += detailPrompt.difficulty.easy
      } else if (this.question.difficulty === 'MEDIUM') {
        systemPrompt += detailPrompt.difficulty.medium
      } else {
        msg.push({role: 'user', content: detailPrompt.difficulty.hard})
        systemPrompt += detailPrompt.difficulty.hard
      }
      if(this.question.language.length>0){
        systemPrompt += detailPrompt.language.haveLanguage + this.question.language
      }else{
        systemPrompt += detailPrompt.language.noLanguage
      }
      if (this.question.discribe && this.question.discribe.trim() !== ''){
        systemPrompt += detailPrompt.describe.haveDescribe + this.question.discribe.trim()
      } else {
        systemPrompt += detailPrompt.describe.noDescribe
      }
      if (this.question.example && this.question.example.trim() !== ''){
        systemPrompt += detailPrompt.example.haveExample + this.question.example.trim()
      } else {
        systemPrompt += detailPrompt.example.noExample
      }
      if (this.question.type === 'SINGLE_CHOICE') {
        systemPrompt += detailPrompt.typeTail.single
      } else if (this.question.type === 'MULTIPLE_CHOICE') {
        systemPrompt += detailPrompt.typeTail.multiple
      } else{
        systemPrompt += detailPrompt.typeTail.programming
      }
      systemPrompt += detailPrompt.tmpTail
      msg.push({role: 'system', content: systemPrompt})
      //放入历史对话
      for (let chat of this.chats) {
        if (chat.role === 'user') {
          msg.push({role: 'user', content: chat.chatResponse})
        }
        msg.push({role: 'assistant', content: chat.chatResponse})
      }
      return msg
    },
    async handleGenerate() {
      const trimmed = this.userInput.trim();
      if (!trimmed) {
        this.$emit('info', '请输入有效内容', 'warning');
        return;
      }
      if (trimmed.length > 1000) {
        this.$emit('info', '输入内容不能超过1000字', 'warning');
        return;
      }

      this.chats.push({
        role: 'user',
        chatResponse: trimmed,
        creatTime: new Date().toLocaleString()
      })

      this.userInput = '';

      this.currentResponse = {
        isDeepThinking: this.useDeepThinking,
        deepThinkingResponse: " ",
        chatResponse: " ",
        creatTime: new Date().toLocaleString(),
        useTime: 0,
      }

      this.controller = new AbortController();
      const signal = this.controller.signal;
      let startTime = performance.now();
      let endTime = performance.now();
      this.isCurrentGenerating = true
      this.scrollToBottom();

      try {
        const response = await fetch("http://localhost:5110/chat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.useDeepThinking ? "deepseek-reasoner" : "deepseek-chat",
            messages: this.bulidPrompt(),
            frequency_penalty: 1,
            stream: true,
          }),
          signal:signal
        });

        if (!response.ok) {
          this.$emit('info', '无法连接服务器，请稍后再试', 'error');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let reasonResult = '';
        let contentResult = '';

        let isStart = false;
        let isFinishThink = false;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          this.scrollToBottom();
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            let message = line.replace(/^data:\s*/, '');
            if (!message || message === '[DONE]') {
              this.$emit('info', '出题结束', 'success');
              break;
            } else if (message === ': keep-alive') {
              this.$emit('info', '请稍等，出题还在继续，并未中断', 'wrong');
              break
            }

            try {
              const parsed = JSON.parse(message);

              if (parsed.choices && parsed.choices[0].delta) {
                if (parsed.choices[0].delta.content) {
                  if (!isFinishThink) {
                    isFinishThink = true;
                    endTime = performance.now();
                  }
                  contentResult += parsed.choices[0].delta.content;
                  this.currentResponse.chatResponse = contentResult;
                }
                if (parsed.choices[0].delta.reasoning_content) {
                  if (!isStart) {
                    isStart = true;
                    startTime = performance.now();
                  }
                  reasonResult += parsed.choices[0].delta.reasoning_content;
                  this.currentResponse.deepThinkingResponse = reasonResult;
                  this.currentResponse.isDeepThinking = true;
                }
              }

            } catch (e) {
              console.log('解析JSON失败:', e);
            }
          }
        }
        this.$emit('info', '生成已结束', 'success')

      }catch (error) {
        this.$emit('info', '无法连接服务器，请检查后重试', 'error');
        console.error('请求失败:', error);
      } finally {
        if (this.controller) {
          this.controller = null;
        }
        const totalTime = Math.round((endTime - startTime) / 1000);
        this.currentResponse.useTime = this.useDeepThinking ? totalTime : 0;
        if (this.currentResponse.chatResponse.trim() !== '') {
          this.chats.push({
            role: 'assistant',
            isDeepThinking: this.currentResponse.isDeepThinking,
            deepThinkingResponse: this.currentResponse.deepThinkingResponse,
            chatResponse: this.currentResponse.chatResponse,
            creatTime: this.currentResponse.creatTime,
            useTime: this.currentResponse.useTime,
          })
        }

        this.isCurrentGenerating = false
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.chat-window');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    copyChat(text, index) {
      navigator.clipboard.writeText(text).then(() => {
        this.copiedIndex = index;
        setTimeout(() => {
          this.copiedIndex = null;
        }, 2000);
      });
    }
  }
}
</script>

<style scoped>
.chat-window {
  height: 490px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.chat-window::-webkit-scrollbar {
  width: 6px;
}
.chat-window::-webkit-scrollbar-thumb {
  background-color: #007bff;
  border-radius: 3px;
}
.chat-window::-webkit-scrollbar-track {
  background: transparent;
}

.chat-bubble {
  display: inline-block;
  padding: 10px 14px;
  margin: 6px 0;
  border-radius: 12px;
  line-height: 1.5;
  word-break: break-word;
  max-width: 75%;
  min-width: 40px;
  white-space: pre-wrap;
}

.user-bubble {
  background-color: #f0f6ff;
  align-self: flex-end;
  border: 1px solid #ddd;
  text-align: left;
}

.ai-bubble {
  background-color: #ffffff;
  align-self: flex-start;
  border: 1px solid #ddd;
  text-align: left;
}

.chat-input-area {
  border-top: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.input-box {
  width: 100%;
  height: 135px;
  padding: 8px;
  font-size: 18px;
  margin-bottom: 8px;
}

.input-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deepthink-btn {
  padding: 6px 16px;
  border: 1px solid #007bff;
  background-color: white;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 14px;
  color: #007bff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.deepthink-btn:hover {
  background-color: #e6f0ff;
  transform: scale(1.05);
  color: #0056b3;
}

.deepthink-btn:active{
  transform: scale(1);
}

.deepthink-btn.active {
  background-color: #007bff;
  color: white;
}

.send-btn {
  padding: 6px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover {
  transform: scale(1.05);
  background-color: #0062cc;
}

.send-btn:active {
  transform: scale(1);
}

.send-btn:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
  transform: none;
}
.send-btn:disabled:hover {
  background-color: #cccccc;
  transform: none;
}
.chat-info-bar {
  position: relative;
  width: 100%;
  background: white;
  color: #595959;
  font-size: 18px;
  font-weight: 600;
  padding: 0;
  text-align: center;
  line-height: 48px;
  z-index: 2;
  pointer-events: none;
}

.current-bubble{
  background-color: #fffbf0;
  animation: pulse 1.5s infinite;
  display: inline-block;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #ccc;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: 6px;
}

@keyframes spin {
  to {
    transform: rotate(720deg);
  }
}

.copy-button {
  position: absolute;
  bottom: -7px;
  right: -40px;
  padding: 0;
  display: flex;
  border: none;
  background-color: white;
  transition: all 0.2s;
}

.copy-button:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.copy-button:active {
  transform: scale(0.95);
}

img {
  user-select: none;
  -webkit-user-drag: none;

}

.markdown-content {
  overflow-x: auto;
  white-space: normal;
  max-width: 100%;
  padding-bottom: 4px; /* 给滑动条留空间 */
}

.markdown-content p {
  margin: 0;
}

.markdown-content li {
  margin: 0;
}

.markdown-content pre {
  overflow-x: auto;
  white-space: pre;
  margin: 0;
  display: block;
}

.markdown-content code {
  font-family: Consolas, Monaco, 'Courier New', monospace;
}

.markdown-content::-webkit-scrollbar {
  height: 6px;
}

.markdown-content::-webkit-scrollbar-track {
  background: transparent; /* 隐藏轨道 */
}

.markdown-content::-webkit-scrollbar-thumb {
  background-color: #5b9df9; /* 蓝色滚动条 */
  border-radius: 3px;
}
</style>

