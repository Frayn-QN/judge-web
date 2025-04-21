<template>
  <div class="uploaded-problems-container">
    <div v-if="isAdmin"
         class="admin-tip">
      <i class="el-icon-info" />
      <span>管理员此界面显示所有题目</span>
    </div>

    <!-- 题目列表组件 -->
    <problem-list ref="problemList"
                  :data="problemList"
                  :loading="loading"
                  :total="total"
                  :current-page="page.pageNum"
                  :page-size="page.pageSize"
                  has-actions
                  @row-click="handleRowClick"
                  @page-change="handlePageChange"
                  @size-change="handleSizeChange" />
  </div>
</template>

  <script>
import { loadUploaded } from '@/api/problem'
import ProblemList from '@/components/List/ProblemList.vue'

export default {
  name: 'UploadedProblems',
  components: { ProblemList },
  data () {
    return {
      loading: false,
      problemList: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    isAdmin () {
      return this.$store.getters.roles?.includes('ADMIN')
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true
        const res = await loadUploaded(this.page)
        this.problemList = res.data.list || []
        this.total = res.data.total || 0
      } catch (error) {
        console.error('获取题目列表失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    handleRowClick (row) {
      this.$router.push(`/coach/edit/${row.id}`)
    },

    handlePageChange (pageNum) {
      this.page.pageNum = pageNum
      this.fetchData()
    },

    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.fetchData()
    }
  }
}
  </script>

  <style lang="scss" scoped>
.uploaded-problems-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .admin-tip {
    margin-bottom: 20px;
    padding: 12px;
    background: #f4f4f5;
    border-radius: 4px;
    color: #909399;
    font-size: 13px;

    i {
      margin-right: 8px;
    }

    span {
      vertical-align: middle;
    }
  }

  ::v-deep .problem-list-container {
    margin-top: 0;

    .el-table {
      border-radius: 4px;

      th {
        background-color: #f8f9fa;
        font-weight: 600;
      }
    }
  }
}
</style>
