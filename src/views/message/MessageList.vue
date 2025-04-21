<template>
  <div class="message-list">
    <div v-if="messages.length === 0"
         class="empty-tip">
      暂无消息
    </div>

    <el-card v-for="msg in messages"
             :key="msg.id"
             class="message-item">
      <div class="message-header">
        <h3 class="title">{{ msg.title }}</h3>
        <el-tag :type="listType === 'received' ? 'success' : 'info'">
          {{ listType === 'received' ? '来自' : '发送给' }}
          {{ listType === 'received' ? msg.sendName : msg.receiveName }}
        </el-tag>
      </div>

      <div class="message-meta">
        <time class="time">{{ formatTime(msg.sendTime) }}</time>
      </div>

      <div class="message-content">
        <div :class="['content-text', { 'expanded': msg.expand }]"
             @click="toggleExpand(msg)">
          {{ msg.content }}
        </div>
        <el-button type="text"
                   class="toggle-btn"
                   @click="toggleExpand(msg)">
          {{ msg.expand ? '收起内容' : '展开完整内容' }}
        </el-button>
      </div>
    </el-card>

    <el-pagination v-if="pagination.total > 0"
                   :current-page="pagination.pageNum"
                   :page-sizes="[10, 20, 50]"
                   :page-size="pagination.pageSize"
                   :total="pagination.total"
                   layout="total, sizes, prev, pager, next"
                   @size-change="handleSizeChange"
                   @current-change="handlePageChange" />
  </div>
</template>

<script>
import { formatISO } from '@/utils'

export default {
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      required: true
    },
    listType: {
      type: String,
      default: 'received',
      validator: v => ['received', 'sent'].includes(v)
    }
  },
  methods: {
    formatTime: formatISO,

    toggleExpand (msg) {
      this.$set(msg, 'expand', !msg.expand)
    },

    handleSizeChange (size) {
      this.$emit('page-change', { pageSize: size, pageNum: 1 })
    },

    handlePageChange (page) {
      this.$emit('page-change', { pageNum: page, pageSize: this.pagination.pageSize })
    }
  }
}
  </script>

  <style scoped>
.message-item {
  margin-bottom: 20px;
  transition: box-shadow 0.3s;
}

.message-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.message-meta {
  margin-bottom: 12px;
  color: #666;
}

.message-content {
  position: relative;
}

.content-text {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  cursor: pointer;
  line-height: 1.6;
}

.content-text.expanded {
  max-height: none;
  -webkit-line-clamp: unset;
}

.toggle-btn {
  padding-left: 0;
  font-size: 12px;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.el-pagination {
  margin-top: 30px;
  justify-content: center;
}
</style>
