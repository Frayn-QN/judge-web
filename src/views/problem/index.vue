<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword"
                placeholder="搜索题目（名称、序号）"
                clearable
                style="width: 360px; margin-bottom: 20px;"
                @keyup.enter.native="handleFilter"
                @clear="handleFilter">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="handleFilter" />
      </el-input>
    </div>

    <!-- 使用公用列表组件 -->
    <problem-list :data="list"
                  :loading="listLoading"
                  :total="total"
                  :current-page="listQuery.pageNum"
                  :page-size="listQuery.pageSize"
                  @row-click="handleRowClick"
                  @page-change="handlePageChange"
                  @size-change="handleSizeChange" />
  </div>
</template>

  <script>
import ProblemList from '@/components/List/ProblemList'
import { loadProblem, searchProblem } from '@/api/problem'
import Page from '@/entity/Page'

export default {
  name: 'Problem',
  components: { ProblemList },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 15,
        keyword: ''
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      this.listLoading = true
      try {
        const page = new Page(this.listQuery.pageNum)
        page.pageSize = this.listQuery.pageSize

        const response = this.listQuery.keyword
          ? await searchProblem(page, this.listQuery.keyword)
          : await loadProblem(page)

        this.list = response.data.list || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('获取题目列表失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.listLoading = false
      }
    },

    handleFilter () {
      this.listQuery.pageNum = 1
      this.getList()
    },

    handleRowClick (row) {
      this.$router.push(`/problem/${row.id}`)
    },

    handlePageChange (newPage) {
      this.listQuery.pageNum = newPage
      this.getList()
    },

    handleSizeChange (newSize) {
      this.listQuery.pageSize = newSize
      this.listQuery.pageNum = 1
      this.getList()
    }
  }
}
  </script>

  <style lang="scss" scoped>
.app-container {
  padding: 20px;
}
</style>
