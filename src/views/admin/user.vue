<!-- 父组件 ParentPage.vue -->
<template>
  <div class="parent-container">
    <!-- 搜索区域 -->
    <div class="search-box">
      <el-input v-model="keyword"
                placeholder="搜索用户名/邮箱"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="handleSearch" />
      </el-input>
    </div>

    <!-- 用户列表组件 -->
    <user-list ref="userList"
               :ban="true"
               :data="userData"
               :total="total"
               :page-num="pageNum"
               :page-size="pageSize"
               show-pagination
               @page-change="handlePageChange"
               @refresh="fetchUserData"
               @ban="handleBanAction" />

    <!-- 封禁弹窗 -->
    <ban-dialog ref="banDialog"
                @ban="handleBanSubmit" />
  </div>
</template>

  <script>
import { banUser, getBanTime, loadUser, searchUser } from '@/api/user'
import UserList from '@/components/List/UserList.vue'
import BanDialog from './BanDialog.vue'
import Page from '@/entity/Page'

export default {
  components: { UserList, BanDialog },
  data () {
    return {
      keyword: '',
      userData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.fetchUserData()
  },
  methods: {
    // 获取用户数据
    async fetchUserData () {
      try {
        const page = new Page(this.pageNum)
        page.pageSize = this.pageSize

        const res = this.keyword
          ? await searchUser(page, this.keyword)
          : await loadUser(page)
        this.userData = res.data.list
        this.total = res.data.total
      } catch (error) {
        console.error('获取题目列表失败:', error)
        this.$message.error('数据加载失败')
      }
    },

    // 处理分页变化
    handlePageChange ({ pageNum, pageSize }) {
      this.pageNum = pageNum
      this.pageSize = pageSize
      this.fetchUserData()
    },

    // 处理搜索
    handleSearch () {
      this.pageNum = 1
      this.fetchUserData()
    },

    async handleBanAction (targetID) {
      const res = await getBanTime(targetID)
      const isBanned = res.data !== null
      this.$refs.banDialog.open(targetID, isBanned)
    },

    async handleBanSubmit (targetID, banTime) {
      try {
        await banUser(targetID, banTime)
        this.$message.success('操作成功！')
      } catch (error) {
        console.error('封禁失败:', error)
        this.$message.error('操作失败！')
      }
    }
  }
}
  </script>

  <style scoped>
.parent-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.search-box {
  margin-bottom: 20px;
  width: 400px;
}
</style>
