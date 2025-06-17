<template>
  <div class="question-table">
    <table>
      <thead>
      <tr class="table-head">
        <th>
          <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
          />
        </th>
        <th class="left">题目</th>
        <th>题型</th>
        <th>创建人</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="q in questions" :key="q.id">
        <td>
          <input
              type="checkbox"
              :checked="isChecked(q.id)"
              @change="toggleSelect(q.id)"
          />
        </td>
        <td class="left">
          <span class="clickable" @click="showDetail(q)">{{ q.content }}</span>
        </td>
        <td>{{ getTypeLabel(q.type) }}</td>
        <td>小明</td>
        <td>
          <button class="edit-btn">编辑</button>
          <button class="delete-btn">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>


export default {
  name: 'QuestionTable',
  props: {
    questions: Array,
    selected: Array
  },
  methods: {
    getTypeLabel(type) {
      switch (type) {
        case 'SINGLE_CHOICE': return '单选题'
        case 'MULTIPLE_CHOICE': return '多选题'
        case 'PROGRAMMING': return '编程题'
        default: return type
      }
    },
    showDetail(q) {
      alert(`题目详情：${q.content}`)
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
      if (event.target.checked) {
        const allIds = this.questions.map(q => q.id)
        this.$emit('update:selected', allIds)
      } else {
        this.$emit('update:selected', [])
      }
    }
  },
  computed: {
    allSelected() {
      return this.questions.length > 0 && this.selected.length === this.questions.length
    }
  }
  // mounted() {
  //   this.loadData()
  // }
}
</script>

<style scoped>
.question-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgb(0 0 0 / 0.1);
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
th.left, td.left {
  text-align: left;
}
td.left{
  max-width: 300px;
}
.table-head{
  background-color: #f9f9f9;
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
</style>