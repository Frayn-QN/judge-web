<template>
  <div class="pset-list-container">
    <el-table v-loading="loading"
              :data="data"
              element-loading-text="加载中..."
              border
              fit
              highlight-current-row
              @row-click="handleRowClick">
      <el-table-column label="题集名称"
                       min-width="240">
        <template slot-scope="{row}">
          <div class="pset-name">{{ row.name }}</div>
          <div class="pset-intro">{{ row.introduction || '暂无描述' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间"
                       width="160"
                       align="center">
        <template slot-scope="{row}">
          <span>{{ formatTime(row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="最后更新"
                       width="160"
                       align="center">
        <template slot-scope="{row}">
          <span>{{ formatTime(row.updateTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div v-if="pagination.total > 0"
         class="pagination-container">
      <el-pagination :current-page="pagination.pageNum"
                     :page-size="10"
                     :total="pagination.total"
                     layout="prev, pager, next, jumper"
                     background
                     @current-change="$emit('page-change', $event)" />
    </div>
  </div>
</template>

<script>
import { formatISO } from '@/utils'

export default {
  name: 'PSetList',
  props: {
    data: { type: Array, default: () => [] },
    loading: Boolean,
    pagination: { type: Object, required: true }
  },
  methods: {
    formatTime: formatISO,
    handleRowClick (row) {
      this.$emit('item-click', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.pset-list-container {
  margin: 12px 0;

  ::v-deep .el-table__row {
    cursor: pointer;

    &:hover {
      td {
        background-color: #f5f7fa !important;
      }
    }
  }
}

.pset-name {
  font-size: 14px;
  color: #303133;
}

.pset-intro {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.pagination-container {
  margin-top: 16px;
  text-align: right;
}
</style>
