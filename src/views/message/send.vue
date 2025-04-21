<template>
  <div class="message-send-container">
    <el-card class="send-form">
      <!-- 公告切换按钮 -->
      <div v-if="isAdmin"
           class="announcement-switch">
        <el-button type="warning"
                   plain
                   :icon="isAnnouncement ? 'el-icon-close' : 'el-icon-mic'"
                   @click="toggleAnnouncement">
          {{ isAnnouncement ? '退出公告模式' : '发送系统公告' }}
        </el-button>
        <span v-if="isAnnouncement"
              class="announcement-tip">当前为公告模式</span>
      </div>

      <el-form ref="messageForm"
               :model="form"
               :rules="rules"
               label-width="80px">
        <!-- 接收人输入 -->
        <el-form-item v-if="!isAnnouncement"
                      label="接收用户"
                      prop="receiveName">
          <el-input v-model="form.receiveName"
                    placeholder="请输入接收用户名"
                    clearable />
        </el-form-item>

        <!-- 消息标题 -->
        <el-form-item label="消息标题"
                      prop="title">
          <el-input v-model="form.title"
                    :placeholder="isAnnouncement ? '请输入公告标题' : '请输入消息标题'" />
        </el-form-item>

        <!-- 消息内容 -->
        <el-form-item label="消息内容"
                      prop="content">
          <el-input v-model="form.content"
                    type="textarea"
                    :rows="5"
                    :placeholder="isAnnouncement ? '请输入公告内容' : '请输入消息内容'"
                    maxlength="500"
                    show-word-limit />
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item class="action-buttons">
          <el-button type="primary"
                     :icon="isAnnouncement ? 'el-icon-mic' : 'el-icon-message'"
                     @click="submitForm">
            {{ isAnnouncement ? '发布公告' : '发送消息' }}
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

  <script>
import { addMessage } from '@/api/message'
import { UserAuth } from '@/entity/enums'

export default {
  data () {
    return {
      isAnnouncement: false,
      form: {
        receiveName: '',
        title: '',
        content: ''
      },
      rules: {
        receiveName: [
          {
            required: true,
            message: '请输入接收用户名',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!this.isAnnouncement && !value) {
                callback(new Error('请输入接收用户名'))
              } else {
                callback()
              }
            }
          }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 50, message: '标题长度不能超过50个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { max: 500, message: '内容长度不能超过500个字符', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    isAdmin () {
      return this.$store.getters.roles.includes(UserAuth.Admin)
    }
  },

  methods: {
    // 切换公告模式
    toggleAnnouncement () {
      this.isAnnouncement = !this.isAnnouncement
      this.$nextTick(() => {
        this.$refs.messageForm.clearValidate()
      })
    },

    // 提交表单
    submitForm () {
      this.$refs.messageForm.validate(async valid => {
        if (valid) {
          try {
            const messageData = {
              sendName: this.$store.getters.userName,
              receiveName: this.isAnnouncement ? 'ALL' : this.form.receiveName,
              receiveID: this.isAnnouncement ? 'ALL' : '', // 根据后端要求处理
              title: this.form.title,
              content: this.form.content
            }

            await addMessage(messageData)
            this.$message.success(this.isAnnouncement ? '公告发布成功' : '消息发送成功')
            this.resetForm()
          } catch (error) {
            this.$message.error(error.message || '发送失败，请稍后重试')
          }
        }
      })
    },

    // 重置表单
    resetForm () {
      this.$refs.messageForm.resetFields()
      this.isAnnouncement = false
    }
  }
}
  </script>

  <style scoped>
.message-send-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.send-form {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.announcement-switch {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.announcement-tip {
  color: #e6a23c;
  font-size: 14px;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
}

::v-deep .el-textarea__inner {
  resize: vertical;
  min-height: 100px;
}
</style>
