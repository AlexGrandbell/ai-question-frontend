<template>
  <div class="markdown-container" v-html="renderedHtml"></div>
</template>

<script>
import { marked } from 'marked'

export default {
  name: 'MarkdownView',
  data() {
    return {
      renderedHtml: ''
    }
  },
  mounted() {
    fetch('/a.md')
        .then(res => res.text())
        .then(md => {
          this.renderedHtml = marked.parse(md)
        })
        .catch(err => {
          this.renderedHtml = '<p style="color:red;">加载失败：' + err.message + '</p>'
        })
  }
}
</script>

<style scoped>
.markdown-container {
  padding: 24px;
  background-color: #ffffff;
  color: #333;
  line-height: 1.6;
  max-width: 1800px;
  margin: 0 auto;
  height: calc(100% - 60px);
  overflow-y: auto;
  border-radius: 10px;
}
.markdown-container h1,
.markdown-container h2,
.markdown-container h3 {
  margin-top: 1.5em;
}
.markdown-container code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 4px;
}
.markdown-container pre {
  background-color: #f8f8f8;
  padding: 10px;
  overflow: auto;
  border-radius: 4px;
}
</style>