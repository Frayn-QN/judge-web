<template>
  <div class="task-container">
    <!-- 题目跳转区域 -->
    <el-card class="problem-jump-box">
      <el-link type="primary"
               :underline="false"
               class="problem-link"
               @click="navigateToProblem">
        <span class="serial">#{{ task.serial }}</span>
        <span class="problem-name">{{ task.problemName }}</span>
      </el-link>
    </el-card>

    <!-- 评测状态区域 -->
    <el-card class="status-card">
      <template #header>
        <div class="card-header">
          <span>评测状态/评测结果：</span>
          <el-tag :type="getStatusType(task.status)"
                  effect="dark">
            {{ task.status }}
          </el-tag>
        </div>
      </template>

      <el-descriptions :column="2"
                       border>
        <el-descriptions-item label="判题时间"
                              width="200">
          {{ formatISO(task.judgeTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="得分">
          {{ task.score || 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="详细结果"
                              :span="2">
          <pre class="result-pre">{{ formattedResult }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 代码展示区域 -->
    <el-card class="code-card">
      <template #header>
        <div class="code-header">
          <span>您的代码：</span>
          <div class="language-indicator">
            <div class="language-dot"
                 :style="dotStyle" />
            <span class="language-text">{{ languageLabel }}</span>
          </div>
        </div>
      </template>
      <el-input type="textarea"
                :rows="15"
                :value="task.answer.code"
                readonly
                class="code-area"
                spellcheck="false"
                resize="none"
                placeholder="// 提交代码将在此显示" />
    </el-card>
  </div>
</template>

  <script>
import { getTask } from '@/api/task'
import { TaskStatus, Language } from '@/entity/enums'
import { getStatusType } from '@/utils/page'
import { formatISO } from '@/utils'

const LANGUAGE_COLORS = {
  [Language.C]: '#555555',
  [Language.Cpp]: '#f34b7d',
  [Language.Java]: '#b07219',
  [Language.Python]: '#3572A5',
  [Language.Lua]: '#000080',
  [Language.Verilog]: '#848bf3'
}

export default {
  name: 'TaskDetail',
  data () {
    return {
      task: {
        id: '',
        problemID: '',
        answer: {
          language: '',
          code: ''
        },
        serial: 0,
        judgeTime: '',
        status: '',
        score: '',
        result: undefined
      }
    }
  },
  computed: {
    taskID () {
      return this.$route.params.id
    },
    formattedResult () {
      return JSON.stringify(this.task?.result || {}, null, 2)
    },
    languageLabel () {
      return Language[this.task.answer.language] || 'Unknown'
    },
    dotStyle () {
      return {
        backgroundColor: LANGUAGE_COLORS[this.task.answer.language] || '#cccccc'
      }
    }
  },
  created () {
    this.fetchTaskData()
    this.setupWebSocketHandlers()
  },
  methods: {
    getStatusType,
    formatISO,

    async fetchTaskData () {
      try {
        const res = await getTask(this.taskID)
        this.task = res.data

        // 根据状态判断是否需要连接WebSocket
        if ([TaskStatus.COMPILING, TaskStatus.EXECUTING].includes(this.task.status)) {
          this.connectWebSocket()
        }
      } catch (error) {
        console.error('获取任务详情失败:', error)
        this.$message.error('获取评测详情失败')
      }
    },

    // WebSocket连接
    connectWebSocket () {
      console.log('需要建立WebSocket连接，当前状态:', this.task.status)
      // TODO: 实现WebSocket连接逻辑
    },

    // WebSocket处理
    setupWebSocketHandlers () {
      // TODO: 实现WebSocket事件处理
    },

    navigateToProblem () {
      this.$router.push(`/problem/${this.task.problemID}`)
    }
  }
}
  </script>

  <style scoped>
.task-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.problem-jump-box {
  margin-bottom: 20px;
  transition: box-shadow 0.3s;
}

.problem-link {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.serial {
  margin-right: 12px;
  font-weight: 600;
  color: #303133;
}

.problem-name {
  color: #606266;
}

.status-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: Consolas, Monaco, monospace;
  margin: 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.code-card {
  margin-top: 20px;
}

.code-area {
  font-family: "Fira Code", Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
}

::v-deep .el-textarea__inner {
  background-color: #f8f9fa !important;
  border: 1px solid #ebeef5 !important;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.language-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.language-text {
  font-size: 13px;
  color: #606266;
  font-family: "Helvetica Neue";
}
</style>
