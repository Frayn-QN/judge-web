<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword"
                placeholder="搜索题集（名称、描述）"
                clearable
                style="width: 360px; margin-bottom: 20px;"
                @keyup.enter.native="handleFilter"
                @clear="handleFilter">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="handleFilter" />
      </el-input>
    </div>

    <!-- 题集列表 -->
    <el-table v-loading="listLoading"
              :data="list"
              element-loading-text="数据加载中..."
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @row-click="handleRowClick">
      <el-table-column label="题集名称"
                       min-width="240">
        <template slot-scope="{row}">
          <div class="pset-name">{{ row.name }}</div>
          <div class="pset-intro">{{ row.introduction || '暂无描述' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间"
                       width="180"
                       align="center">
        <template slot-scope="{row}">
          <span>{{ formatTime(row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间"
                       width="180"
                       align="center">
        <template slot-scope="{row}">
          <span>{{ formatTime(row.updateTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空数据提示 -->
    <div v-if="!listLoading && list.length === 0"
         class="empty-container">
      <el-empty description="暂无公开题集" />
    </div>

    <!-- 分页组件 -->
    <el-pagination v-show="total > 0"
                   :current-page="listQuery.pageNum"
                   :page-size="listQuery.pageSize"
                   :total="total"
                   :page-sizes="[10, 20, 50, 100]"
                   layout="prev, pager, next, sizes, jumper"
                   background
                   style="margin-top: 20px;"
                   @current-change="handlePageChange"
                   @size-change="handleSizeChange" />
  </div>
</template>

<script>
import { loadPSet, searchPSet } from '@/api/problemset'
import Page from '@/entity/Page'
import { formatISO } from '@/utils'

export default {
  name: 'PublicProblemSet',
  data () {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
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
        const page = new Page(this.listQuery.pageNum, this.listQuery.pageSize)

        const response = this.listQuery.keyword
          ? await searchPSet(page, this.listQuery.keyword)
          : await loadPSet(page)

        this.list = response.data.list || []
        this.total = response.data.total || 0
      } catch (error) {
        console.error('获取题集失败:', error)
        this.$message.error('数据加载失败')
      } finally {
        this.listLoading = false
      }
    },

    // 格式化时间显示
    formatTime: formatISO,

    handleFilter () {
      this.listQuery.pageNum = 1
      this.getList()
    },

    handlePageChange (newPage) {
      this.listQuery.pageNum = newPage
      this.getList()
    },

    handleSizeChange (newSize) {
      this.listQuery.pageSize = newSize
      this.listQuery.pageNum = 1
      this.getList()
    },

    handleRowClick (row) {
      this.$router.push(`/pset/${row.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.pset-name {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #409eff;
  }
}

.pset-intro {
  font-size: 13px;
  color: #909399;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.empty-container {
  margin: 40px 0;
  text-align: center;
}

::v-deep .el-table__row {
  td:not(.el-table__cell:nth-last-child(2)) {
    cursor: pointer;
  }

  &:hover {
    td {
      background-color: #f5f7fa !important;
    }
  }
}
</style>
