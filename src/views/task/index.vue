<template>
  <div class="history-container">
    <el-table v-loading="loading"
              :data="tasks"
              style="width: 100%"
              :fit="true"
              highlight-current-row
              empty-text="暂无数据"
              @row-click="handleRowClick">

      <el-table-column prop="serial"
                       label="题目序号"
                       width="100"
                       align="center"
                       header-align="center" />
      <el-table-column prop="problemName"
                       label="题目名称"
                       min-width="240"
                       show-overflow-tooltip
                       header-align="left"
                       align="left" />
      <el-table-column label="判题时间"
                       width="180"
                       align="center"
                       header-align="center">
        <template #default="{ row }">
          {{ row.judgeTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       width="140"
                       align="center"
                       header-align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score"
                       label="得分"
                       width="120"
                       align="center"
                       header-align="center">
        <template #default="{ row }">
          {{ row.score || 0 }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination"
                   :current-page="page.pageNum"
                   :page-sizes="[10, 20, 50]"
                   :page-size="page.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   @size-change="handleSizeChange"
                   @current-change="handlePageChange" />
  </div>
</template>

<script>
import { getHistory } from '@/api/task'
import { getStatusType } from '@/utils/page'

export default {
  name: 'TaskList',
  filters: {
    dateFormat (val) {
      return val ? new Date(val).toLocaleString() : ''
    }
  },
  data () {
    return {
      loading: false,
      tasks: [],
      total: 0,
      page: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    getStatusType,
    async fetchData () {
      try {
        this.loading = true
        const res = await getHistory(this.page)
        this.tasks = res.data.list || []
        this.total = res.data.total || 0
      } catch (error) {
        console.error('获取任务历史失败:', error)
      } finally {
        this.loading = false
      }
    },
    handlePageChange (pageNum) {
      this.page.pageNum = pageNum
      this.fetchData()
    },
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.fetchData()
    },
    handleRowClick (row) {
      this.$router.push(`/task/${row.id}`)
    }
  }
}
</script>

<style scoped>
.history-container {
  padding: 30px;
  min-height: 500px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex; /* 新增 */
  flex-direction: column; /* 新增 */
  align-items: center; /* 新增 */
}

.pagination {
  margin-top: 30px;
  width: 100%; /* 与表格同宽 */
  max-width: 1200px; /* 新增最大宽度限制 */
}

/* 增强表格布局 */
.el-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  max-width: 1200px; /* 新增最大宽度 */
  transition: all 0.3s; /* 响应式过渡效果 */
}

.el-table::before {
  height: 0;
}

/* 优化表头显示 */
.el-table__header th {
  background: #f8f9fa !important;
  font-weight: 600;
  color: #495057;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .history-container {
    padding: 15px;
  }

  .el-table {
    width: 100% !important;
    overflow-x: auto;
  }

  .el-table-column[prop="serial"] {
    width: 80px !important;
  }

  .el-table__body-wrapper {
    overflow-x: auto;
  }
}
</style>
