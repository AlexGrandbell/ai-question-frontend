<template>
  <div class="question-manager">
    <QuestionSearch
        :filter="filter"
        @update:filter="handleFilterUpdate"
        @search="handleSearch"
        @info="showToast"
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
        @show-detail="handleShowDetail"
        @edit="handleShowEditDetail"
        @info="showToast"
    />
    <transition name="fade-dialog">
      <QuestionDetailDialog
          v-if="showDialog"
          :question="currentQuestion"
          @close="showDialog = false"
      />
    </transition>
    <transition name="fade-dialog">
      <QuestionSelfAddDialog
          v-if="showSelfAddDialog"
          @close="showSelfAddDialog = false"
          @created="handleCreatedQuestion"
          @info="showToast"
      />
    </transition>
    <transition name="fade-dialog">
      <QuestionEditDialog
          v-if="showEditDialog"
          :question="currentEditQuestion"
          @close="showEditDialog = false"
          @updated="handleUpdatedQuestion"
          @info="showToast"
      />
    </transition>
    <transition name="fade-dialog">
      <QuestionAIAddDialog
          v-show="showAIGenerateDialog"
          @close="showAIGenerateDialog = false"
          @info="showToast"
          @search="handleSearch"
      />
    </transition>
    <ToastMassage ref="toast" />

  </div>
</template>

<script>
import QuestionSearch from "@/components/QMVCompo/QuestionSearch.vue";
import QuestionTable from '@/components/QMVCompo/QuestionTable.vue'
import AddQuestionMenu from '@/components/QMVCompo/AddQuestionMenu.vue'
import QuestionDetailDialog from '@/components/QuestionDialog/QuestionDetailDialog.vue'
import ToastMassage from "@/components/ToastMassage.vue";
import QuestionSelfAddDialog from "@/components/QuestionDialog/QuestionSelfAddDialog.vue";
import QuestionEditDialog from "@/components/QuestionDialog/QuestionEditDialog.vue";
import QuestionAIAddDialog from "@/components/QuestionDialog/QuestionAIAddDialog.vue";
import axios from "axios";

export default {
  name: 'QuestionManagerView',
  components: {
    QuestionSearch,
    QuestionTable,
    AddQuestionMenu,
    QuestionDetailDialog,
    ToastMassage,
    QuestionSelfAddDialog,
    QuestionEditDialog,
    QuestionAIAddDialog
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
      },
      showDialog: false,
      currentQuestion: null,
      showSelfAddDialog: false,
      currentEditQuestion:null,
      showEditDialog: false,
      showAIGenerateDialog: false
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
            direction: this.filter.direction,
            sortBy: this.filter.sortBy,
            type: this.filter.type,
            keyword: this.filter.keyword,
            language: this.filter.language,
            difficulty: this.filter.difficulty
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
    async handleShowDetail(id) {
      try {
        const res = await axios.get(`/api/questions/${id}`)
        if (res.data.success) {
          this.currentQuestion = res.data.data
          this.showDialog = true
        } else {
          this.$refs.toast.addToast(res.data.message || '获取题目详情失败', 'error')
        }
      } catch (e) {
        console.error('获取题目详情失败', e)
        this.$refs.toast.addToast('获取题目失败', 'error')
      }
    },
    async handleShowEditDetail(id) {
      try {
        const res = await axios.get(`/api/questions/${id}`)
        if (res.data.success) {
          this.currentEditQuestion = res.data.data
          this.showEditDialog = true
        } else {
          this.$refs.toast.addToast(res.data.message || '获取题目详情失败', 'error')
        }
      } catch (e) {
        console.error('获取题目详情失败', e)
        this.$refs.toast.addToast('获取题目失败', 'error')
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
          this.$refs.toast.addToast(res.data.message || '删除成功', 'success')
        } else {
          this.$refs.toast.addToast(res.data.message || '删除失败', 'error')
        }
      } catch (error) {
        console.error('删除请求失败:', error);
        this.$refs.toast.addToast('删除失败，请稍后重试', 'error')
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
          this.$refs.toast.addToast('删除成功', 'success')
        } else {
          this.$refs.toast.addToast('删除失败', 'error')
        }
      } catch (e) {
        console.error('单题删除失败', e);
        this.$refs.toast.addToast('删除失败，请稍后重试', 'error')
      }
    },
    //打开哪个出题
    handleAddQuestion(type) {
      if (type === 'manual') {
        this.showSelfAddDialog = true
      }else if (type === 'AI') {
        this.showAIGenerateDialog = true
      }
    },
    handleCreatedQuestion() {
      this.showSelfAddDialog = false
      this.$refs.toast.addToast('创建成功', 'success')
      this.handleSearch()
    },
    handleUpdatedQuestion() {
      this.showEditDialog = false;
      this.$refs.toast.addToast('编辑成功', 'success')
      this.handleSearch();
    },
    showToast(message, type = 'success') {
      this.$refs.toast.addToast(message, type)
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

.fade-dialog-enter-active,
.fade-dialog-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-dialog-enter-from,
.fade-dialog-leave-to {
  opacity: 0;
}
.fade-dialog-enter-to,
.fade-dialog-leave-from {
  opacity: 1;
}
</style>