<template>
  <div class="question-search">
    <div class="row top-row">
      <div class="type-section">
        <span class="label">题型：</span>
        <div class="button-group rounded-group">
          <button
            v-for="item in typeOptions"
            :key="item.value"
            :class="['group-button', { active: localFilter.type === item.value }]"
            @click="updateType(item.value)"
          >{{ item.label }}</button>
        </div>
      </div>

      <div class="search-box">
        <div class="input-wrapper">
          <img src="../../assets/icons/search.svg" alt="search" />
          <input
            type="text"
            v-model="localFilter.keyword"
            placeholder="输入关键字搜索题干, 按回车搜索"

            @keyup.enter="onSearch"
          />
          <img
            src="../../assets/icons/cross.svg"
            class="clear-icon"
            v-if="localFilter.keyword"
            @click="localFilter.keyword = ''"
            alt="clear"
          />
        </div>
        <button class="rst-btn" @click="onReset">重置</button>
        <button class="search-btn" @click="onSearch">搜索</button>
        <img
          class="filter-toggle-icon"
          :src="expanded ? require('@/assets/icons/collapse.svg') : require('@/assets/icons/expand.svg')"
          @click="expanded = !expanded"
          alt="toggle"
        />
      </div>
    </div>

    <transition name="fade">
      <div
          v-show="expanded"
          class="more-filters-container"
      >
        <div class="more-filters">
          <div class="filter-line">
            <span class="label">难度：</span>
            <div class="button-group rounded-group">
              <button v-for="d in difficultyOptions" :key="d.value"
                :class="['group-button', { active: localFilter.difficulty === d.value }]"
                @click="localFilter.difficulty = d.value">{{ d.label }}</button>
            </div>
          </div>
          <div class="filter-line">
            <span class="label">排序依据：</span>
            <div class="button-group rounded-group">
              <button v-for="s in sortFields" :key="s.value"
                :class="['group-button', { active: localFilter.sortBy === s.value }]"
                @click="localFilter.sortBy = s.value">{{ s.label }}</button>
            </div>
          </div>
          <div class="filter-line">
            <span class="label">排序顺序：</span>
            <div class="button-group rounded-group">
              <button
                :class="['group-button', { active: localFilter.direction === 'ASC' }]"
                @click="localFilter.direction = 'ASC'"
              >升序</button>
              <button
                :class="['group-button', { active: localFilter.direction === 'DESC' }]"
                @click="localFilter.direction = 'DESC'"
              >降序</button>
            </div>
          </div>
          <div class="filter-line">
            <span class="label">考点：</span>
            <div class="tag-input-container">
              <span
                  class="tag"
                  v-for="(tag, index) in languageTags"
                  :key="tag"
              >
                {{ tag }}
                <span class="remove-tag" @click="removeTag(index)">×</span>
              </span>
              <input
                  type="text"
                  class="input-tag tag-input"
                  v-model="newTag"
                  @keyup.enter="addTag"
                  placeholder="例如 Java，按回车添加"
              />
            </div>
            <img
              src="../../assets/icons/cross.svg"
              class="clear-icon"
              v-if="languageTags.length > 0"
              @click="clearTags"
              alt="clear"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import '../QuestionDialog/TagCSS.css';
export default {
  name: 'QuestionSearch',
  data() {
    return {
      localFilter: {
        type: '',
        keyword: '',
        difficulty: '',
        sortBy: 'createdAt',
        direction: 'ASC',
        language: ''
      },
      expanded: false,
      newTag: '',
      typeOptions: [
        {label: '全部', value: ''},
        {label: '单选', value: 'SINGLE_CHOICE'},
        {label: '多选', value: 'MULTIPLE_CHOICE'},
        {label: '编程', value: 'PROGRAMMING'}
      ],
      difficultyOptions: [
        {label: '全部', value: ''},
        {label: '简单', value: 'EASY'},
        {label: '中等', value: 'MEDIUM'},
        {label: '困难', value: 'HARD'}
      ],
      sortFields: [
        {label: '创建时间', value: 'createdAt'},
        {label: '难度', value: 'difficulty'},
        {label: '题型', value: 'type'}
      ]
    }
  },
  computed: {
    languageTags: {
      get() {
        if (!this.localFilter.language) return [];
        return this.localFilter.language.split(',').filter(t => t.trim() !== '');
      },
      set(tags) {
        this.localFilter.language = tags.join(',');
      }
    }
  },
  methods: {
    updateType(value) {
      this.localFilter.type = value
    },
    onSearch() {
      const newFilter = {...this.localFilter};
      this.$emit('update:filter', newFilter);
      this.$emit('search')
    },
    onReset() {
      this.localFilter = {
        type: '',
        keyword: '',
        difficulty: '',
        sortBy: 'createdAt',
        direction: 'ASC',
        language: ''
      };
      this.newTag = '';
      this.$emit('info', '已重置搜索条件', 'success')
      this.$emit('update:filter', {...this.localFilter});
      this.$emit('search');
    },
    addTag() {
      const tag = this.newTag.trim();
      if (!tag) {
        this.newTag = '';
        return;
      }
      if (this.languageTags.includes(tag)) {
        this.$emit('info', '标签已存在', 'warning');
        this.newTag = '';
        return;
      }
      if (tag.includes(',')) {
        this.$emit('info', '标签不能包含逗号', 'warning');
        this.newTag = '';
        return;
      }
      if (tag.length > 10) {
        this.$emit('info', '每个标签最多10个字符', 'warning');
        this.newTag = '';
        return;
      }
      const updatedTags = [...this.languageTags, tag];
      this.languageTags = updatedTags;
      this.newTag = '';
    },
    removeTag(index) {
      const updatedTags = [...this.languageTags];
      updatedTags.splice(index, 1);
      this.languageTags = updatedTags;
    },
    clearTags() {
      this.languageTags = [];
      this.newTag = '';
    }
  }
}
</script>

<style scoped>
.question-search {
  position: relative;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 10px rgb(0 0 0 / 0.1);
  padding: 16px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  min-height: 45px;
}

.type-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: 600;
  margin-right: 4px;
  white-space: nowrap;
}

.search-box {
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 8px;
}

.search-btn{
  background-color: #2196f3;
  font-size: 14px;
  color: white;
  border: none;
  padding: 6px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.rst-btn{
  background-color: #dddddd;
  font-size: 14px;
  color: black;
  border: none;
  padding: 6px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.filter-toggle-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.search-btn:hover,
.filter-toggle-icon:hover,
.rst-btn:hover {
  transform: scale(1.1);
}

.search-btn:active,
.filter-toggle-icon:active,
.rst-btn:active {
  transform: scale(0.95);
}

.more-filters {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-group {
  display: flex;
}

.rounded-group .group-button {
  border: 1px solid #ccc;
  background: white;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  border-right: none;
  transition: transform 0.1s ease;
}

.rounded-group .group-button:first-child {
  border-radius: 4px 0 0 4px;
}

.rounded-group .group-button:last-child {
  border-radius: 0 4px 4px 0;
  border-right: 1px solid #ccc;
}

.group-button.active {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}

.group-button:not(.active):hover {
  background-color: #53b8ff;
  color: white;
  border-color: #53b8ff;
}

.text-input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  width: 200px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0px 10px;
  flex-grow: 1;
}

.input-wrapper img {
  width: 16px;
  margin-right: 6px;
  opacity: 0.6;
}

.input-wrapper input {
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 500px;
}
img {
  pointer-events: auto;
  user-drag: none;
  -webkit-user-drag: none;
}
.more-filters-container {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  right: 0;
  background: white;
  margin-top: 5px;
  border-radius:  10px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.31);
  z-index: 1;
  overflow: hidden;
  padding: 16px;
}
.clear-icon {
  width: 30px;
  height: 20px;
  padding: 0;
  margin: 0;
  opacity: 1;
  cursor: pointer;
  transition: transform 0.2s;
}

.clear-icon:hover {
  transform: scale(1.2);
}

.clear-icon:active {
  transform: scale(0.95);
}

</style>
