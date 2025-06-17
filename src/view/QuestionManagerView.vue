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
    handleSearch() {
      // TODO: fetch question list from API using this.filter
    },
    handleBatchDelete() {
      // TODO: call API to delete selected questions
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
  border: 1px solid #e74c3c;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.danger-button:disabled {
  background-color: #ccc;
  border: 1px solid #b8b8b8;
  cursor: not-allowed;
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