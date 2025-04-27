<template>
  <el-container class="problem-container">
    <el-main>
      <!-- 题目基本信息 -->
      <div class="problem-header">
        <h1>{{ problem.name }} <el-tag>{{ problem.serial }}</el-tag></h1>
        <div class="meta-info">
          <el-tag :color="getLevelColor(problem.level)"
                  effect="dark">
            {{ problem.level }}
          </el-tag>
          <div class="constraints">
            <span><i class="el-icon-time" /> {{ formatTime(problem.timeLimit) }}</span>
            <span><i class="el-icon-cpu" /> {{ formatMemory(problem.memoryLimit) }}</span>
          </div>
        </div>
      </div>

      <!-- 题目描述 -->
      <el-card class="description-box">
        <div slot="header">
          <span class="panel-title">题目描述</span>
        </div>
        <vue-markdown :source="problem.content"
                      class="markdown-body" />
      </el-card>

      <!-- 答题区 -->
      <editor :problem-id="problem.id"
              :languages="problem.language"
              @submit="handleSubmit" />
    </el-main>
  </el-container>
</template>

<script>
import { getProblem } from '@/api/problem'
import { addTask } from '@/api/task'
import { getLevelColor } from '@/utils/page'
import Editor from './Editor.vue'

import VueMarkdown from 'vue-markdown'

export default {
  name: 'ProblemDetail',
  components: { VueMarkdown, Editor },
  data () {
    return {
      problem: {
        id: '',
        serial: 0,
        name: '',
        level: '简单',
        content: '',
        timeLimit: 1000,
        memoryLimit: 256
      },
      code: '// 在这里编写你的代码\n',
      currentLanguage: 'java',
      languageOptions: [
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'python', label: 'Python 3' }
      ],
      editorOptions: {
        tabSize: 4,
        mode: 'text/x-java',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' }
      },
      submitting: false
    }
  },
  created () {
    this.getProblem()
  },
  methods: {
    getLevelColor,

    async getProblem () {
      try {
        const { id } = this.$route.params
        const res = await getProblem(id)
        this.problem = res.data
      } catch (error) {
        this.$message.error('题目加载失败')
        console.error(error)
      }
    },

    formatTime (ms) {
      return `${ms}ms`
    },

    formatMemory (mb) {
      return `${mb}MB`
    },

    async handleSubmit (task) {
      try {
        const taskID = (await addTask(task)).data
        this.$message.success('提交成功！即将跳转评测页面')
        this.$router.push(`/task/${taskID}`)
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败，请检查网络')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.problem-container {
  height: calc(100vh - 60px); // 留出顶部导航栏高度

  .problem-header {
    margin-bottom: 20px;
    h1 {
      margin: 0 0 10px;
      display: flex;
      align-items: center;
      .el-tag {
        margin-left: 10px;
      }
    }
    .meta-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .constraints {
      color: #606266;
      font-size: 14px;
      i {
        margin-right: 5px;
      }
      span + span {
        margin-left: 20px;
      }
    }
  }

  .panel-title {
    font-size: 16px;
    font-weight: 500;
  }

  .description-box {
    margin-bottom: 20px;
    .markdown-body {
      padding: 10px;
      font-size: 14px;
      >>> pre {
        background: #f6f8fa;
        padding: 12px;
        border-radius: 4px;
      }
    }
  }

  .io-section {
    margin-bottom: 20px;
    pre {
      white-space: pre-wrap;
      font-family: Consolas, Monaco, monospace;
    }
  }
}
</style>
