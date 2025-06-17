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
        批量删除
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
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}

.danger-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.danger-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>