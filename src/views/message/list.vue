<template>
  <div class="message-container">
    <el-tabs v-model="activeTab"
             @tab-click="loadData">
      <el-tab-pane label="收件箱"
                   name="received" />
      <el-tab-pane label="发件箱"
                   name="sent" />
    </el-tabs>

    <message-list :messages="messages"
                  :pagination="pagination"
                  :list-type="activeTab"
                  @page-change="handlePageChange" />
  </div>
</template>

<script>
import { loadPersonal, loadSent } from '@/api/message'
import MessageList from './MessageList.vue'

export default {
  components: { MessageList },
  data () {
    return {
      activeTab: 'received',
      messages: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const loader = this.activeTab === 'received' ? loadPersonal : loadSent
      try {
        const { data } = await loader(this.pagination)
        this.messages = data.list
        this.pagination.total = data.total
      } catch (error) {
        this.$message.error('数据加载失败')
      }
    },

    handlePageChange ({ pageNum, pageSize }) {
      this.pagination = { ...this.pagination, pageNum, pageSize }
      this.loadData()
    }
  }
}
</script>

<style scoped>
.message-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
