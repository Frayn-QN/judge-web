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
        <div>
          <el-button v-if="isTaskRunning"
                     type="danger"
                     size="small"
                     :loading="deleteLoading"
                     @click="handleDelete">
            删除记录
          </el-button>
        </div>
      </template>
    </el-card>

    <el-descriptions :column="2"
                     border
                     class="result-descriptions">
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
import { getTask, deleteTask } from '@/api/task'
import { TaskStatus, Language } from '@/entity/enums'
import { getStatusType } from '@/utils/page'
import { formatISO } from '@/utils'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

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
          code: '',
          judge: true
        },
        serial: 0,
        judgeTime: '',
        status: '',
        score: '',
        result: undefined
      },
      deleteLoading: false,
      stompClient: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5
    }
  },
  computed: {
    taskID () {
      return this.$route.params.id
    },
    formattedResult () {
      return this.formatResult(this.task.result, this.task.status)
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
  },
  beforeUnmount () {
    this.disconnectWebSocket()
  },
  methods: {
    getStatusType,
    formatISO,

    async fetchTaskData () {
      try {
        const res = await getTask(this.taskID)
        this.task = res.data

        // 根据状态动态管理WebSocket连接
        if (this.isTaskRunning()) {
          this.connectWebSocket()
        }
      } catch (error) {
        console.error('获取任务详情失败:', error)
        this.$message.error('获取评测详情失败')
      }
    },

    // WebSocket连接
    connectWebSocket () {
      if (this.stompClient?.connected) return

      const socket = new SockJS(process.env.VUE_APP_BASE_API + '/ws-task')
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: this.handleWebSocketConnect,
        onStompError: this.handleWebSocketError
      })

      this.stompClient.activate()
    },

    // WebSocket连接成功
    handleWebSocketConnect () {
      this.reconnectAttempts = 0
      const subscribePath = `/topic/task/${this.taskID}`

      this.stompClient.subscribe(subscribePath, message => {
        const updateData = JSON.parse(message.body)
        this.handleStatusUpdate(updateData)
      })
    },

    // 状态更新处理
    handleStatusUpdate (updateData) {
      // 深度合并更新（保留未变更字段）
      this.task = {
        ...this.task,
        ...updateData,
        answer: { ...this.task.answer, ...updateData.answer }
      }
      //   window.location.reload(true)

      // 完成后断开连接
      if (!this.isTaskRunning()) {
        this.disconnectWebSocket()
      }
    },

    // 判断测评是否正在运行，是则需要保持连接
    isTaskRunning () {
      return [
        TaskStatus.COMPILING,
        TaskStatus.EXECUTING
      ].includes(this.task.status)
    },

    // 错误处理与重连
    handleWebSocketError (error) {
      console.error('WebSocket连接错误:', error)
      if (this.reconnectAttempts++ < this.maxReconnectAttempts) {
        setTimeout(() => this.connectWebSocket(), 2000)
      }
    },

    // 断开连接清理资源
    disconnectWebSocket () {
      if (this.stompClient?.connected) {
        this.stompClient.deactivate()
      }
      this.stompClient = null
    },

    navigateToProblem () {
      this.$router.push(`/problem/${this.task.problemID}`)
    },

    async handleDelete () {
      try {
        this.$confirm('此操作将永久删除该评测记录，是否继续？', '警告', {
          type: 'warning',
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          center: true
        }).then(async () => {
          this.deleteLoading = true
          await deleteTask(this.task.id)
          this.$message.success('删除成功')
          this.$router.back() // 跳转到任务列表
        })
      } catch (error) {
        this.$message.error(`删除失败: ${error.message}`)
      } finally {
        this.deleteLoading = false
      }
    },
    formatResult (result, status) {
      if (['AC', 'WA'].includes(status)) {
        const accept = result?.accept ?? 'N/A'
        const wrong = result?.wrong ?? 'N/A'
        const total = result?.total ?? 'N/A'
        return `通过数：${accept}\n错误数：${wrong}\n总数：${total}`
      }
      return result?.msg ?? JSON.stringify(result || {}, null, 2)
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
  gap: 12px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
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
