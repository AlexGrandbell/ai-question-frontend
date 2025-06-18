<template>
  <div class="question-table">
    <div class="table-head-fixed">
      <table>
        <thead>
        <tr class="table-head">
          <th class="with-divider" style="width: 40px">
            <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
            />
          </th>
          <th class="left with-divider">题目</th>
          <th class="with-divider" style="width: 77px">题型</th>
          <th class="with-divider" style="width: 50px">难度</th>
          <th class="with-divider" style="width: 100px">创建人</th>
          <th style="width: 145px">操作</th>
        </tr>
        </thead>
      </table>
    </div>
    <div class="table-scroll">
      <table>
        <tbody>
        <tr v-for="q in questions" :key="q.id">
          <td style="width: 40px">
            <input
                type="checkbox"
                :checked="isChecked(q.id)"
                @change="toggleSelect(q.id)"
                :disabled="q.userId !== getUserInfo().id"
            />
          </td>
          <td class="left">
            <span class="clickable" @click="showDetail(q)">{{ q.content }}</span>
          </td>
          <td style="width: 80px">{{ getTypeLabel(q.type) }}</td>
          <td style="width: 50px; text-align: center;">
            <span :class="['difficulty-cell', getDifficultyClass(q.difficulty)]">
              {{ getDifficultyLabel(q.difficulty) }}
            </span>
          </td>
          <td style="width: 100px">{{ q.userName || '未知'  }}</td>
          <td style="width: 130px">
            <button class="edit-btn" @click="handleEdit(q)">编辑</button>
            <button class="delete-btn" @click="handleDelete(q)">删除</button>
          </td>
        </tr>
        </tbody>
        <tbody v-if="questions.length === 0">
        <tr>
          <td colspan="5" class="empty-row">暂无数据, 先去出题吧</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-bar">
      <div class="page-total">共 {{ pageInfo.totalPages }} 页</div>

      <div class="page-buttons">
        <button
            @click="$emit('change-page', pageInfo.number - 1)"
            :disabled="pageInfo.first"
        >
          上一页
        </button>

        <button
            v-if="visiblePages[0] > 0"
            :class="{ active: pageInfo.number === 0 }"
            @click="$emit('change-page', 0)"
        >
          1
        </button>

        <span v-if="visiblePages[0] > 1">...</span>

        <button
            v-for="i in visiblePages"
            :key="i"
            :class="{ active: i === pageInfo.number }"
            @click="$emit('change-page', i)"
        >
          {{ i + 1 }}
        </button>

        <span v-if="visiblePages[visiblePages.length - 1] < pageInfo.totalPages - 2">...</span>

        <button
            v-if="visiblePages[visiblePages.length - 1] < pageInfo.totalPages - 1"
            :class="{ active: pageInfo.number === pageInfo.totalPages - 1 }"
            @click="$emit('change-page', pageInfo.totalPages - 1)"
        >
          {{ pageInfo.totalPages }}
        </button>

        <button
            @click="$emit('change-page', pageInfo.number + 1)"
            :disabled="pageInfo.last"
        >
          下一页
        </button>
      </div>

      <div class="page-size">
        <select :value="pageInfo.size" @change="$emit('change-size', +$event.target.value)">
          <option :value="5">5条/页</option>
          <option :value="10">10条/页</option>
          <option :value="20">20条/页</option>
        </select>
      </div>

      <div class="page-jump">
        <label>跳至</label>
        <input
            type="text"
            min="1"
            :max="pageInfo.totalPages"
            v-model.number="jumpPage"
            @keyup.enter="jumpToPage"
        />
        <span>页</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth';

export default {
  name: 'QuestionTable',
  props: {
    questions: Array,
    selected: Array,
    pageInfo: Object
  },
  data() {
    return {
      jumpPage: null
    }
  },
  methods: {
    getUserInfo() {
      return getUserInfo() || { id: -1, name: '未知用户' }
    },
    getTypeLabel(type) {
      switch (type) {
        case 'SINGLE_CHOICE':
          return '单选题'
        case 'MULTIPLE_CHOICE':
          return '多选题'
        case 'PROGRAMMING':
          return '编程题'
        default:
          return type
      }
    },
    getDifficultyLabel(difficulty) {
      switch (difficulty) {
        case 'EASY':
          return '简单'
        case 'MEDIUM':
          return '中等'
        case 'HARD':
          return '困难'
        default:
          return difficulty
      }
    },
    showDetail(q) {
      this.$emit('show-detail', q.id)
    },
    isChecked(id) {
      return this.selected.includes(id)
    },
    toggleSelect(id) {
      const selected = [...this.selected]
      const index = selected.indexOf(id)
      if (index === -1) selected.push(id)
      else selected.splice(index, 1)
      this.$emit('update:selected', selected)
    },
    toggleSelectAll(event) {
      const currentUserId = this.getUserInfo().id;
      if (event.target.checked) {
        const ownIds = this.questions.filter(q => q.userId === currentUserId).map(q => q.id);
        this.$emit('update:selected', ownIds);
      } else {
        this.$emit('update:selected', []);
      }
    },
    jumpToPage() {
      const page = this.jumpPage - 1
      if (page >= 0 && page < this.pageInfo.totalPages) {
        this.$emit('change-page', page)
      } else {
        this.$emit('info','页码超出范围', 'warning')
      }
    },
    getDifficultyClass(difficulty) {
      switch (difficulty) {
        case 'EASY':
          return 'easy';
        case 'MEDIUM':
          return 'medium';
        case 'HARD':
          return 'hard';
        default:
          return '';
      }
    },
    handleEdit(q) {
      if (q.userId !== this.getUserInfo().id) {
        this.$emit('info', '您无权编辑非您所出的题目', 'warning');
        return;
      }
      this.$emit('edit', q.id);
    },
    handleDelete(q) {
      if (q.userId !== this.getUserInfo().id) {
        this.$emit('info', '您无权删除非您所出的题目', 'warning');
        return;
      }
      this.$emit('delete-one', q.id);
    }
  },
  computed: {
    allSelected() {
      const currentUserId = this.getUserInfo().id;
      const ownIds = this.questions.filter(q => q.userId === currentUserId).map(q => q.id);
      return ownIds.length > 0 && ownIds.every(id => this.selected.includes(id));
    },
    visiblePages() {
      const total = this.pageInfo.totalPages || 1
      const current = this.pageInfo.number || 0
      const range = 2
      const pages = []

      if (total <= 3) {
        return Array.from({ length: total }, (_, i) => i)
      }

      const start = Math.max(1, current - range)
      const end = Math.min(total - 2, current + range)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }
  }
}
</script>

<style scoped>
.question-table {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 250px);
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.table-head-fixed {
  flex: 0 0 auto;
}

.table-scroll {
  overflow-y: scroll;
  flex: 1 1 auto;
}

.table-scroll table {
  width: 100%;
  border-collapse: collapse;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

th.left, td.left {
  text-align: left;
}

th.left{
  padding-left: 15px;
}

td.left {
  max-width: 300px;
}

.table-head {
  background-color: #f6f6f6;
  font-weight: bold;
}

.clickable {
  cursor: pointer;
  color: #3498db;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
}

.edit-btn {
  background: none;
  border: none;
  color: #3498db;
  font-size: 16px;
  cursor: pointer;
}

.delete-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 16px;
  margin-left: 8px;
}

.pagination-bar {
  flex: 0 0 auto;
  padding: 10px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.pagination-bar button {
  padding: 6px 10px;
  border: none;
  background-color: #f2f2f2;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-bar button.active {
  background-color: #3498db;
  color: white;
}

.page-buttons button {
  margin: 0 2px;
}

.page-buttons button.active {
  background-color: #3498db;
  color: white;
}

.page-size select{
  width: 120px;
  height: 25px;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
}

.page-jump input {
  padding: 2px 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 30px;
  text-align: center;
  outline: none;
  font-size: 14px;
}


.page-jump {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-row {
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 16px;
}

.difficulty-cell {
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.easy {
  background-color: #27ae60;
}

.medium {
  background-color: #f39c12;
}

.hard {
  background-color: #e74c3c;
}

th.with-divider {
  position: relative;
}

th.with-divider::after {
  content: '';
  position: absolute;
  top: 4px;
  bottom: 4px;
  right: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #ddd 40%, #c5c5c5 60%, transparent);
}
</style>
