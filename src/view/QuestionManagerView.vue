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
        :page-info="pageInfo"
        @update:selected="selectedIds = $event"
        @change-page="handlePageChange"
        @change-size="handlePageSizeChange"
        @delete-one="handleSingleDelete"
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
      selectedIds: [],
      pageInfo: {
        number: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
      }
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
            page: this.filter.page,
            size: this.filter.size,
            direction: 'ASC'
          }
        })
        this.questions = res.data.content
        this.pageInfo = {
          ...res.data,
          number: res.data.number,
          size: res.data.size,
          totalPages: res.data.totalPages,
          first: res.data.first,
          last: res.data.last
        }
      } catch (e) {
        console.error('加载题目失败', e)
      }
    },
    async handlePageChange(page) {
      this.filter.page = page
      await this.handleSearch()
    },
    async handlePageSizeChange(size) {
      this.filter.size = size
      this.filter.page = 0
      await this.handleSearch()
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
    async handleSingleDelete(id) {
      if (!confirm('确定删除这道题目吗？')) return;
      try {
        const res = await axios.post('/api/questions/batch-delete', {
          ids: [id]
        });
        if (res.data.success) {
          this.selectedIds = this.selectedIds.filter(i => i !== id);
          this.handleSearch();
          alert('删除成功');
        } else {
          alert('删除失败');
        }
      } catch (e) {
        console.error('单题删除失败', e);
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