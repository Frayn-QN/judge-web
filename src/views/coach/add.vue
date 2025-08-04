<template>
  <div class="add-problem-container">
    <el-card v-loading="loading">
      <div class="header">
        <h2>新建题目</h2>
        <el-button type="info"
                   icon="el-icon-back"
                   @click="$router.push('/coach')">
          返回列表
        </el-button>
      </div>

      <problem-form ref="problemForm"
                    :init-data="emptyProblem"
                    :show-serial="false"
                    @submit="handleSubmit" />
    </el-card>
  </div>
</template>

  <script>
import { addProblem } from '@/api/problem'
import ProblemForm from './components/ProblemForm'
import { ProblemLevel } from '@/entity/enums'

export default {
  name: 'AddProblem',
  components: { ProblemForm },
  data () {
    return {
      loading: false,
      emptyProblem: {
        name: '',
        level: ProblemLevel.lv1,
        content: '',
        example: [],
        expectation: [],
        extra: [],
        timeLimit: 1000,
        memoryLimit: 256,
        testCount: 0,
        language: []
      }
    }
  },
  methods: {
    async handleSubmit (formData) {
      try {
        this.loading = true
        await addProblem({
          ...formData,
          creatorID: this.$store.state.user.id,
          createTime: new Date().toISOString()
        })

        this.$message.success('题目创建成功!')
        this.$router.push('/coach')
      } catch (error) {
        this.$message.error(`创建失败: ${error.message || '未知错误'}`)
      } finally {
        this.loading = false
      }
    }
  }
}
  </script>

  <style lang="scss" scoped>
.add-problem-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;

    h2 {
      color: #303133;
      font-weight: 500;
    }
  }

  ::v-deep {
    .el-form {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 4px;

      .el-form-item {
        margin-bottom: 22px;

        &:last-child {
          margin-top: 40px;
          text-align: center;
        }
      }

      // 修复CSS错误
      .file-manager {
        .file-card {
          &:hover {
            .delete-btn {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>
