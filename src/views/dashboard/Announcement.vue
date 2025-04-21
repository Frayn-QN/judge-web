<template>
  <el-row class="section">
    <el-col :span="24">
      <div class="section-header">
        <h2 class="section-title">公告：</h2>

        <!-- 公告列表 -->
        <div class="announcement-list">
          <div v-for="(item, index) in announcements"
               :key="item.id"
               class="announcement-item">
            <div class="announcement-header">
              <span class="index">#{{ index + 1 }}</span>
              <span class="time">{{ formatTime(item.sendTime) }}</span>
            </div>
            <h3 class="title">{{ item.title }}</h3>
            <div class="content">{{ item.content }}</div>
          </div>

          <div v-if="announcements.length === 0"
               class="empty">
            <i class="el-icon-info" /> 暂无公告
          </div>
        </div>

        <!-- 分页控件 -->
        <el-pagination small
                       layout="prev, pager, next"
                       :page-size="5"
                       :total="total"
                       @current-change="handlePageChange" />
      </div>
    </el-col>
  </el-row>
</template>

  <script>
import { loadPublic } from '@/api/message'
import Page from '@/entity/Page'
import { formatISO } from '@/utils'

export default {
  name: 'Announcement',
  data () {
    return {
      announcements: [],
      total: 0,
      currentPage: 1
    }
  },
  mounted () {
    this.loadAnnounce()
  },
  methods: {
    // 格式化时间显示
    formatTime: formatISO,

    async loadAnnounce () {
      try {
        const page = new Page(this.currentPage)
        page.pageSize = 3
        const res = await loadPublic(page)
        this.announcements = res.data.list
        this.total = res.data.total
      } catch (error) {
        this.$message.error('公告加载失败')
      }
    },

    handlePageChange (page) {
      this.currentPage = page
      this.loadAnnounce()
    }
  }
}
  </script>

  <style lang="scss" scoped>
.section {
  margin-bottom: 40px;

  &-header {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &-title {
    font-size: 20px;
    color: #303133;
    margin-bottom: 15px;
  }
}

.announcement-list {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
}

.announcement-item {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
  }
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;

  .index {
    color: #909399;
    font-size: 14px;
  }

  .time {
    color: #606266;
    font-size: 14px;
  }
}

.title {
  color: #303133;
  font-size: 16px;
  margin: 0 0 8px 0;
}

.content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.empty {
  text-align: center;
  color: #909399;
  padding: 20px;

  .el-icon-info {
    margin-right: 8px;
  }
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
