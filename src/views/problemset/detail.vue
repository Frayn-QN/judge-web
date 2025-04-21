<template>
  <div class="pset-detail-container">
    <!-- 基本信息区域 -->
    <el-card class="base-info">
      <div class="header">
        <h2>{{ pset.name }}</h2>
        <div class="action-buttons">
          <!-- 收藏按钮 -->
          <el-button v-if="!authExists"
                     type="success"
                     icon="el-icon-star-off"
                     @click="handleCollect">
            {{ isCollected ? '已收藏' : '收藏题集' }}
          </el-button>

          <!-- 编辑按钮 -->
          <el-button v-if="hasManageAuth"
                     type="primary"
                     icon="el-icon-edit"
                     @click="handleEditPset">
            编辑题集
          </el-button>

          <!-- 删除按钮 -->
          <el-button v-if="hasManageAuth"
                     type="danger"
                     icon="el-icon-delete"
                     @click="handleDeletePset">
            删除题集
          </el-button>
        </div>
      </div>

      <div class="meta">
        <p class="description">{{ pset.introduction || '暂无描述' }}</p>
        <div class="time-info">
          <span>创建时间：{{ formatTime(pset.createTime) }}</span>
          <span>更新时间：{{ formatTime(pset.updateTime) }}</span>
        </div>
      </div>
    </el-card>

    <!-- 成员管理 -->
    <div v-if="authExists"
         class="user-management">
      <el-collapse v-model="activeCollapse">
        <!-- 管理员 -->
        <el-collapse-item name="managers">
          <template slot="title">
            <span class="collapse-title">管理员（{{ managers.length }}人）</span>
            <el-button v-if="hasManageAuth"
                       type="text"
                       size="mini"
                       @click.stop="handleAddUser(PSetUserAuth.Manage)">
              添加管理员
            </el-button>
          </template>
          <user-list :data="managers"
                     :editable="hasManageAuth"
                     @remove="handleRemoveUser($event, PSetUserAuth.Manage)" />
        </el-collapse-item>

        <!-- 成员 -->
        <el-collapse-item name="members">
          <template slot="title">
            <span class="collapse-title">成员（{{ members.length }}人）</span>
            <el-button v-if="hasManageAuth"
                       type="text"
                       size="mini"
                       @click.stop="handleAddUser(PSetUserAuth.Member)">
              添加成员
            </el-button>
          </template>
          <user-list :data="members"
                     :editable="hasManageAuth"
                     @remove="handleRemoveUser($event, PSetUserAuth.Member)" />
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 题目列表 -->
    <el-card class="problem-list">
      <div class="header">
        <h3>题目列表</h3>
        <el-button v-if="hasManageAuth"
                   type="primary"
                   icon="el-icon-circle-plus"
                   @click="handleAddProblem">
          添加题目
        </el-button>
      </div>

      <problem-list :data="problems"
                    :loading="problemLoading"
                    :total="problemTotal"
                    :current-page="problemPage.pageNum"
                    :page-size="problemPage.pageSize"
                    :selectable="false"
                    :has-actions="hasManageAuth"
                    @page-change="handleProblemPageChange"
                    @size-change="handlePageSizeChange"
                    @delete="handleDeleteProblem"
                    @row-click="handleProblemClick" />

      <el-pagination :current-page="problemPage.pageNum"
                     :page-size="problemPage.pageSize"
                     :total="problemTotal"
                     layout="prev, pager, next"
                     @current-change="handleProblemPageChange" />
    </el-card>

    <!-- 用户选择弹窗 -->
    <user-select-dialog ref="userSelectDialog"
                        @added="loadUsers" />

    <!-- 编辑弹窗 -->
    <edit-pset-dialog ref="editPsetDialog"
                      :initial-data="pset"
                      @submit="handleEditSubmit" />

    <!-- 题目选择弹窗 -->
    <problem-select-dialog ref="problemSelectDialog"
                           @added="loadProblems" />

  </div>
</template>

  <script>
import { getAuth, getInfo, getUser, getProblem, deleteUser, modifyPSet, deleteProblem, deletePSet, favorite } from '@/api/problemset'
import UserList from '../../components/List/UserList.vue'
import ProblemList from '@/components/List/ProblemList.vue'
import UserSelectDialog from './components/UserSelectDialog.vue'
import EditPsetDialog from './components/EditPsetDialog.vue'
import ProblemSelectDialog from './components/ProblemSelectDialog.vue'
import { PSetStatus, PSetUserAuth } from '@/entity/enums'
import { formatISO } from '@/utils'
import { getLevelColor } from '@/utils/page'

export default {
  components: { UserList, ProblemList, UserSelectDialog, EditPsetDialog, ProblemSelectDialog },
  data () {
    return {
      PSetUserAuth,
      pset: {
        id: '',
        name: '',
        introduction: '',
        status: PSetStatus.Public
      },
      hasManageAuth: false, // manage
      authExists: false, // manage+member
      isCollected: false, // favorite
      activeCollapse: [],
      members: [],
      managers: [],
      problems: [],
      problemLoading: false,
      problemPage: { pageNum: 1, pageSize: 10 },
      problemTotal: 0
    }
  },
  created () {
    this.initData()
  },
  methods: {
    getLevelColor,

    async initData () {
      const psetID = this.$route.params.id

      // 获取权限
      const authRes = await getAuth(psetID)
      if (authRes.data) {
        this.isCollected = authRes.data === PSetUserAuth.Favorite
        this.hasManageAuth = authRes.data === PSetUserAuth.Manage
        this.authExists = this.hasManageAuth || authRes.data === PSetUserAuth.Member
      }

      // 获取题集信息
      const infoRes = await getInfo(psetID)
      this.pset = infoRes.data

      // 获取成员信息
      if (this.authExists) this.loadUsers()

      // 获取题目列表
      if (this.authExists) this.loadProblems()
    },

    async loadUsers () {
      const [managersRes, membersRes] = await Promise.all([
        getUser(this.pset.id, PSetUserAuth.Manage),
        getUser(this.pset.id, PSetUserAuth.Member)
      ])
      this.managers = managersRes.data
      this.members = membersRes.data
    },

    async loadProblems () {
      this.problemLoading = true
      try {
        const res = await getProblem(this.problemPage, this.pset.id)
        this.problems = res.data.list
        this.problemTotal = res.data.total
      } finally {
        this.problemLoading = false
      }
    },

    handleProblemPageChange (page) {
      this.problemPage.pageNum = page
      this.loadProblems()
    },

    formatTime: formatISO,

    // 打开编辑弹窗
    handleEditPset () {
      this.currentPsetData = {
        name: this.pset.name,
        introduction: this.pset.introduction,
        status: this.pset.status
      }
      this.$refs.editPsetDialog.open()
    },

    // 处理提交
    async handleEditSubmit (formData) {
      try {
        await modifyPSet(formData)
        this.$message.success('修改成功')

        // 刷新题集数据
        const infoRes = await getInfo(this.pset.id)
        this.pset = infoRes.data

        this.$refs.editPsetDialog.close()
      } catch (error) {
        this.$message.error('修改失败：' + error.message)
      }
    },

    // 添加用户
    handleAddUser (authType) {
      this.$refs.userSelectDialog.open(authType)
    },

    // 删除用户
    async handleRemoveUser (userID) {
      try {
        await this.$confirm(`确定要移除该用户吗？`, '警告', {
          type: 'warning'
        })

        await deleteUser(this.pset.id, userID)

        this.loadUsers()
      } catch (error) {
        // 取消删除不处理
      }
    },

    // 题目添加
    handleAddProblem () {
      this.$refs.problemSelectDialog.open(this.pset.id)
    },

    async handleDeleteProblem (problemID) {
      try {
        await this.$confirm('确定要移除此题目吗？', '提示', {
          type: 'warning',
          confirmButtonText: '确定删除',
          cancelButtonText: '取消'
        })

        await deleteProblem(this.pset.id, problemID)
        this.$message.success('题目删除成功')

        // 刷新
        this.loadProblems()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败: ' + error.message)
        }
      }
    },

    handlePageSizeChange (size) {
      this.problemPage.pageSize = size
      this.loadProblems()
    },

    // 收藏处理方法
    async handleCollect () {
      try {
        const action = this.isCollected ? '取消收藏' : '收藏'
        await this.$confirm(`确定要${action}该题集吗？`, '提示', {
          type: 'warning'
        })

        const res = await favorite(this.pset.id, !this.isCollected)
        this.isCollected = res.data.collected
        this.$message.success(`${action}成功`)
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(`操作失败: ${error.message}`)
        }
      }
    },

    // 删除题集
    async handleDeletePset () {
      try {
        await this.$confirm('此操作将永久删除该题集，是否继续？', '警告', {
          type: 'error',
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          distinguishCancelAndClose: true
        })

        await deletePSet(this.pset.id)
        this.$message.success('题集删除成功')

        // 跳转到题集列表页
        this.$router.push('/problemset')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败: ' + error.message)
        }
      }
    },

    handleProblemClick (problem) {
      this.$router.push(`/problem/${problem.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.pset-detail-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .base-info {
    margin-bottom: 20px;

    .meta {
      .description {
        color: #606266;
        line-height: 1.6;
      }

      .time-info {
        margin-top: 15px;
        color: #909399;
        font-size: 13px;

        span + span {
          margin-left: 20px;
        }
      }
    }
  }

  .user-management {
    margin-bottom: 20px;

    .collapse-title {
      margin-right: 15px;
    }
  }

  .problem-list {
    .el-pagination {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
