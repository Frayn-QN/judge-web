<template>
  <div class="user-detail-container">
    <el-card v-loading="loading">
      <!-- 用户信息展示 -->
      <div v-if="!editMode"
           class="info-view">
        <div class="avatar-container">
          <img :src="picSrc(userInfo.avatar)"
               class="user-avatar">
        </div>
        <div class="info-list">
          <div class="info-item">
            <label>用户名：</label>
            <span>{{ userInfo.username }}</span>
          </div>
          <div class="info-item">
            <label>邮箱：</label>
            <span>{{ userInfo.email }}</span>
          </div>
          <div class="info-item">
            <label>角色：</label>
            <el-tag>{{ userInfo.authority }}</el-tag>
          </div>
          <div class="info-item">
            <label>注册时间：</label>
            <span>{{ formatTime(userInfo.registerTime) }}</span>
          </div>
          <div class="info-item intro">
            <label>个人简介：</label>
            <p>{{ userInfo.introduction || '暂无简介' }}</p>
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="action-buttons">
          <el-button v-if="self"
                     type="primary"
                     @click="enterEditMode">
            编辑资料
          </el-button>
          <el-button v-if="self"
                     type="danger"
                     @click="handleUnregister">
            注销账户
          </el-button>
        </div>
      </div>

      <!-- 编辑表单 -->
      <el-form v-else
               ref="form"
               :model="tempUser"
               label-width="100px"
               class="edit-form">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="tempUser.username" />
        </el-form-item>

        <el-form-item label="头像"
                      prop="avatar">
          <el-upload class="avatar-uploader"
                     action="#"
                     :show-file-list="false"
                     :before-upload="beforeAvatarUpload">
            <img v-if="tempUser.avatar"
                 :src="picSrc(tempUser.avatar)"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div class="upload-tip">建议尺寸 200x200，大小不超过2MB</div>
        </el-form-item>

        <el-form-item label="个人简介"
                      prop="introduction">
          <el-input v-model="tempUser.introduction"
                    type="textarea"
                    :rows="4"
                    placeholder="介绍一下自己吧~" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="submitForm">保存修改</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getInfo, changeInfo } from '@/api/user'
import { formatISO } from '@/utils'
import { picSrc } from '@/utils/page'

export default {
  name: 'UserDetail',
  data () {
    return {
      loading: false,
      self: false,
      userInfo: {
        username: '',
        email: '',
        authority: '',
        avatar: '',
        introduction: '',
        registerTime: null
      },
      editMode: false,
      tempUser: {},
      avatarFile: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    picSrc,

    // 获取用户信息
    async fetchData () {
      this.loading = true
      try {
        const id = this.$route.params.id
        if (id === 'info') {
          this.self = true
          const res = await getInfo(null)
          this.userInfo = res.data
        } else {
          const res = await getInfo(id)
          this.userInfo = res.data
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 进入编辑模式
    enterEditMode () {
      this.tempUser = { ...this.userInfo }
      this.editMode = true
    },

    beforeAvatarUpload (file) {
      const isImage = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 2MB!')
        return false
      }

      // 转换为纯Base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Data = e.target.result.split(',')[1] // 去除data:头
        this.tempUser.avatar = base64Data
        this.avatarFile = base64Data // 存储原始Base64数据
      }
      reader.readAsDataURL(file)
      return false
    },

    // 修改后的提交方法
    async submitForm () {
      try {
        this.loading = true
        const payload = {
          ...this.tempUser,
          avatar: this.avatarFile || this.tempUser.avatar
        }

        await changeInfo(payload)
        this.userInfo = { ...payload }
        this.editMode = false
        this.$message.success('修改成功!')
      } catch (error) {
        this.$message.error('修改失败')
      } finally {
        this.loading = false
      }
    },

    // 取消编辑
    cancelEdit () {
      this.editMode = false
      this.tempUser = {}
    },

    // 时间格式化
    formatTime: formatISO,

    // TODO: 注销账户
    handleUnregister () {
    }
  }
}
</script>

<style lang="scss" scoped>
.user-detail-container {
  padding: 20px;

  .user-avatar {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }

  .info-list {
    margin: 20px 0;

    .info-item {
      margin-bottom: 15px;
      font-size: 16px;

      label {
        color: #666;
        min-width: 80px;
        display: inline-block;
      }

      &.intro p {
        white-space: pre-wrap;
        line-height: 1.6;
      }
    }
  }

  .action-buttons {
    margin-top: 30px;
    text-align: center;

    .el-button {
      margin: 0 10px;
    }
  }

  .avatar-uploader {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409eff;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 200px;
      line-height: 200px;
      text-align: center;
    }

    .avatar {
      width: 200px;
      height: 200px;
      display: block;
      object-fit: cover;
    }
  }

  .upload-tip {
    color: #999;
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
