<template>
  <div class="problem-list-container">
    <el-table v-loading="loading"
              :data="data"
              element-loading-text="数据加载中..."
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <!-- 选择列 -->
      <el-table-column v-if="selectable"
                       type="selection"
                       width="55"
                       align="center" />

      <!-- 题号列 -->
      <el-table-column label="题号"
                       prop="serial"
                       width="120"
                       align="center">
        <template slot-scope="{row}">
          <span>#{{ row.serial }}</span>
        </template>
      </el-table-column>

      <!-- 题目名称列 -->
      <el-table-column label="题目名称"
                       min-width="220">
        <template slot-scope="{row}">
          <span class="problem-name">{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 难度列 -->
      <el-table-column label="难度等级"
                       width="150"
                       align="center">
        <template slot-scope="{row}">
          <el-tag effect="dark"
                  :color="getLevelColor(row.level)">
            {{ row.level }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column v-if="hasActions"
                       label="操作"
                       width="150"
                       align="center">
        <template slot-scope="{row}">
          <el-button type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click.stop="$emit('delete', row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 空状态 -->
    <div v-if="!loading && data.length === 0"
         class="empty-container">
      <el-empty :description="emptyText" />
    </div>

    <!-- 分页 -->
    <el-pagination v-show="total > 0"
                   :current-page="currentPage"
                   :page-sizes="pageSizes"
                   :page-size="pageSize"
                   :total="total"
                   layout="prev, pager, next, sizes, jumper"
                   background
                   style="margin-top: 20px;"
                   @current-change="$emit('page-change', $event)"
                   @size-change="$emit('size-change', $event)" />
  </div>
</template>

<script>
import { getLevelColor } from '@/utils/page'

export default {
  name: 'ProblemList',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: Boolean,
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 15
    },
    selectable: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: '暂无题目数据'
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    hasActions: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getLevelColor,

    handleRowClick (row) {
      if (!this.selectable) {
        this.$emit('row-click', row)
      }
    },

    handleSelectionChange (selection) {
      if (this.selectable) {
        this.$emit('selection-change', selection)
      }
    },

    handleDelete (id) {
      this.$emit('delete', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.problem-list-container {
  .problem-name {
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #409eff;
    }
  }

  .empty-container {
    margin: 40px 0;
    text-align: center;
  }

  ::v-deep .el-table__row {
    cursor: pointer;

    &:hover {
      td {
        background-color: #f5f7fa !important;
      }
    }
  }
}
.user-list ::v-deep .el-button {
  font-family: inherit;
}
</style>
