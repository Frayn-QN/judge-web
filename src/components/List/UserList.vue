<template>
  <div class="user-list">
    <el-table :data="data"
              size="mini"
              @row-click="handleRowClick"
              @selection-change="$emit('selection-change', $event)">
      <!-- 可选列 -->
      <el-table-column v-if="selectable"
                       type="selection"
                       width="55" />

      <!-- 数据列 -->
      <el-table-column prop="username"
                       label="用户名" />
      <el-table-column prop="email"
                       label="邮箱" />
      <el-table-column label="头像"
                       width="80">
        <template slot-scope="{row}">
          <el-avatar :src="picSrc(row.avatar)"
                     :size="30">
            {{ row.username[0] }}
          </el-avatar>
        </template>
      </el-table-column>

      <!-- 删除按钮列 -->
      <el-table-column v-if="showRemove"
                       width="80">
        <template slot-scope="{row}">
          <el-button type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click.stop="$emit('remove', row.id)" />
        </template>
      </el-table-column>

      <!-- 权限列 -->
      <el-table-column v-if="showAuthority"
                       label="用户权限"
                       width="150">
        <template slot-scope="{row}">
          <span>{{ formatAuthority(row.authority) }}</span>
        </template>
      </el-table-column>

      <!-- 权限修改按钮列 -->
      <el-table-column v-if="showAuthority"
                       label="权限管理"
                       width="120">
        <template slot-scope="{row}">
          <el-button type="primary"
                     size="mini"
                     @click.stop="$emit('authority', row.id)">
            修改权限
          </el-button>
        </template>
      </el-table-column>

      <!-- 封禁操作列 -->
      <el-table-column v-if="showBan"
                       label="状态管理"
                       width="120">
        <template slot-scope="{row}">
          <el-button :type="'warning'"
                     size="mini"
                     @click.stop="$emit('ban', row.id)">
            封禁
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination v-if="showPagination"
                   :page-num="pageNum"
                   :page-sizes="pageSizes"
                   :page-size="pageSize"
                   :total="total"
                   layout="total, sizes, prev, pager, next, jumper"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { UserAuth } from '@/entity/enums'
import { picSrc } from '@/utils/page'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    editable: Boolean,
    selectable: Boolean, // 是否显示选择列
    clickable: Boolean, // 是否启用行点击
    removable: { // 是否显示删除按钮（覆盖editable）
      type: Boolean,
      default: undefined
    },
    ban: {
      type: Boolean,
      default: false
    },
    authority: {
      type: Boolean,
      default: false
    },
    showPagination: Boolean, // 是否显示分页
    pageNum: { // 当前页码
      type: Number,
      default: 1
    },
    pageSize: { // 每页条数
      type: Number,
      default: 10
    },
    total: { // 总数据量
      type: Number,
      default: 0
    },
    pageSizes: { // 分页尺寸选项
      type: Array,
      default: () => [10, 20, 50, 100]
    }
  },

  computed: {
    // 删除按钮
    showRemove () {
      return this.removable !== undefined ? this.removable : this.editable
    },
    showBan () {
      return this.ban !== undefined ? this.ban : this.editable
    },
    showAuthority () {
      return this.authority !== undefined ? this.ban : this.editable
    }
  },

  methods: {
    picSrc,

    // 行点击处理
    handleRowClick (row) {
      if (this.clickable) {
        this.$emit('row-click', row)
      }
    },

    // 分页大小改变
    handleSizeChange (val) {
      this.$emit('update:pageSize', val)
      this.$emit('page-change', {
        pageNum: this.pageNum,
        pageSize: val
      })
    },

    // 当前页改变
    handleCurrentChange (val) {
      this.$emit('update:pageNum', val)
      this.$emit('page-change', {
        pageNum: val,
        pageSize: this.pageSize
      })
    },

    formatAuthority (auth) {
      const map = {
        [UserAuth.User]: '用户',
        [UserAuth.Coach]: '教练',
        [UserAuth.Admin]: '管理员'
      }
      return map[auth] || '未知权限'
    }
  }
}
</script>

<style scoped>
.user-list {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

/* 表格字体优化 */
.user-list ::v-deep .el-table {
  font-size: 14px;
}

.user-list ::v-deep .el-table thead {
  font-weight: 600;
}

.user-list ::v-deep .el-table__row td {
  color: #475669;
  line-height: 1.6;
}

/* 分页组件 */
.user-list ::v-deep .el-pagination {
  font-weight: 400;
  font-size: 14px;
}

.user-list ::v-deep .el-pagination button,
.user-list ::v-deep .el-pagination span:not([class*="suffix"]) {
  font-size: 14px;
}

.user-list ::v-deep .el-avatar {
  font-weight: 500;
  font-size: 16px;
}

.user-list ::v-deep .el-button {
  font-family: inherit;
}
</style>
