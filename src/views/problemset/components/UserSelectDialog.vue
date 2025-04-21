<template>
  <el-dialog :title="`添加${typeMap[authType]}用户`"
             :visible.sync="visible"
             width="70%">
    <el-input v-model="keyword"
              placeholder="输入用户名或邮箱"
              clearable
              @change="handleSearchChange" />

    <UserList :data="userList"
              :selectable="true"
              :show-pagination="true"
              :page-num="pageNum"
              :page-size="pageSize"
              :total="total"
              @selection-change="handleSelectionChange"
              @page-change="handlePageChange" />

    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :loading="confirmLoading"
                 @click="handleConfirm">添加选中用户（{{ selectedUsers.length }}）</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UserList from '@/components/List/UserList'
import { loadUser, searchUser } from '@/api/user'
import { PSetUserAuth } from '@/entity/enums'
import { addUser } from '@/api/problemset'
import { picSrc } from '@/utils/page'
import Page from '@/entity/Page'

export default {
  components: { UserList },

  data () {
    return {
      visible: false,
      keyword: '',
      userList: [],
      selectedUsers: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      authType: PSetUserAuth.Member,
      confirmLoading: false,
      typeMap: {
        [PSetUserAuth.Manage]: '管理员',
        [PSetUserAuth.Member]: '普通成员'
      }
    }
  },

  methods: {
    picSrc,

    open (authType) {
      this.authType = authType
      this.visible = true
      this.loadUsers()
    },

    async loadUsers () {
      try {
        const page = new Page(this.pageNum)
        page.pageSize = this.pageSize

        const res = this.keyword
          ? await searchUser(page, this.keyword)
          : await loadUser(page)

        this.userList = res.data.list
        this.total = res.data.total
      } catch (error) {
        console.error('用户加载失败:', error)
      }
    },

    handleSearchChange () {
      this.pageNum = 1
      this.loadUsers()
    },

    handlePageChange ({ pageNum, pageSize }) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.loadUsers()
    },

    handleSelectionChange (selection) {
      this.selectedUsers = selection
    },

    async handleConfirm () {
      if (this.selectedUsers.length === 0) return

      this.confirmLoading = true
      let successCount = 0
      const errorUsers = []

      try {
        // 逐个添加用户
        for (const user of this.selectedUsers) {
          try {
            await addUser(this.$route.params.id, user.id, this.authType)
            successCount++
          } catch (error) {
            console.error(`用户 [${user.username}] 添加失败:`, error)
            errorUsers.push({
              username: user.username,
              error: error.message
            })
          }
        }
        // 结果反馈
        if (successCount > 0) {
          this.$emit('added')
          this.$message.success(`成功添加 ${successCount} 位用户`)

          if (errorUsers.length > 0) {
            this.$alert(
              `以下用户添加失败：\n${errorUsers.map(u => `${u.username}：${u.error}`).join('\n')}`,
              '部分添加失败',
              { type: 'warning' }
            )
          } else {
            this.visible = false
          }
        } else {
          this.$message.warning('未能成功添加任何用户')
        }
      } catch (error) {
        console.error('添加流程异常:', error)
        this.$message.error('用户添加过程发生异常')
      } finally {
        this.confirmLoading = false
      }
    }
  }
}
</script>
