<template>
  <div class="question-manager">
    <QuestionSearch
        :filter="filter"
        @update:filter="handleFilterUpdate"
        @search="handleSearch"
    />

    <div class="action-bar">
      <AddQuestionMenu @select="handleAddQuestion" />
      <button
          class="danger-button"
          :disabled="!hasSelection"
          @click="handleBatchDelete"
      >
        <img src="@/assets/icons/trash.svg" alt="trash" />
        <apan>批量删除</apan>
      </button>
    </div>

    <QuestionTable
        :questions="questions"
        :selected="selectedIds"
        @update:selected="selectedIds = $event"
        @refresh="handleSearch"
    />
  </div>
</template>

<script>
import QuestionSearch from "@/components/QuestionSearch.vue";
import QuestionTable from '@/components/QuestionTable.vue'
import AddQuestionMenu from '@/components/AddQuestionMenu.vue'
import axios from "axios";

export default {
  name: 'QuestionManagerView',
  components: {
    QuestionSearch,
    QuestionTable,
    AddQuestionMenu
  },
  data() {
    return {
      filter: {
        type: '',
        keyword: '',
        language: '',
        difficulty: '',
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        direction: 'ASC'
      },
      questions: [],
      selectedIds: []
    }
  },
  computed: {
    hasSelection() {
      return this.selectedIds.length > 0
    }
  },
  methods: {
    handleFilterUpdate(newFilter) {
      this.filter = { ...this.filter, ...newFilter }
    },
    async handleSearch() {
      try {
        const res = await axios.get('/api/questions', {
          params: {
            page: 0,
            size: 10,
            direction: 'ASC'
          }
        })
        this.questions = res.data.content
      } catch (e) {
        console.error('加载题目失败', e)
      }
    },
    async handleBatchDelete() {
      if (this.selectedIds.length === 0) return;

      if (!confirm(`确定删除选中的 ${this.selectedIds.length} 条题目吗？`)) {
        return;
      }

      try {
        const res = await axios.post('/api/questions/batch-delete', {
          ids: this.selectedIds
        });
        if (res.data.success) {
          this.selectedIds = [];
          this.handleSearch();
          alert(res.data.message || '删除成功');
        } else {
          alert(res.data.message || '删除失败');
        }
      } catch (error) {
        console.error('删除请求失败:', error);
        alert('删除失败，请稍后重试');
      }
    },
    // handleAddQuestion(type) {
    handleAddQuestion() {
      // TODO: open modal for type: 'AI' or 'manual'
    }
  },
  mounted() {
    this.handleSearch()
  }
}
</script>

<style scoped>
.question-manager {
  display: flex;
  flex-direction: column;
  gap: 16px;
  user-select: none;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}

.danger-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.danger-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.danger-button:not(:disabled):hover{
  transform: scale(1.1);
}
.danger-button:not(:disabled):active{
  transform: scale(0.95);
}
.danger-button img {
  width: 16px;
  height: 16px;
}
img {
  pointer-events: auto;
  user-drag: none;
  -webkit-user-drag: none;
}
</style>