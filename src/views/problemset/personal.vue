<template>
  <div class="personal-pset-container">
    <div class="create-button-container">
      <el-button type="primary"
                 icon="el-icon-plus"
                 @click="handleCreatePset">
        新建题集
      </el-button>
    </div>

    <!-- 加入的题集 -->
    <div class="section-card">
      <h3 class="section-title">我加入的</h3>

      <!-- 管理 -->
      <div class="sub-section">
        <h4 class="sub-title">管理</h4>
        <p-set-list :data="manageList"
                    :loading="loading.manage"
                    :pagination="pagination.manage"
                    @page-change="handlePageChange('manage', $event)"
                    @item-click="handleItemClick" />
      </div>

      <!-- 成员 -->
      <div class="sub-section">
        <h4 class="sub-title">我参与的</h4>
        <p-set-list :data="memberList"
                    :loading="loading.member"
                    :pagination="pagination.member"
                    @page-change="handlePageChange('member', $event)"
                    @item-click="handleItemClick" />
      </div>
    </div>

    <!-- 我收藏的题集 -->
    <div class="section-card">
      <h3 class="section-title">我收藏的</h3>
      <p-set-list :data="favoriteList"
                  :loading="loading.favorite"
                  :pagination="pagination.favorite"
                  @page-change="handlePageChange('favorite', $event)"
                  @item-click="handleItemClick" />
    </div>

    <!-- 创建题集弹窗 -->
    <edit-pset-dialog ref="createDialog"
                      title="新建题集"
                      @submit="handleCreateSubmit" />

  </div>
</template>

<script>
import { addPSet, loadByAuth } from '@/api/problemset'
import { PSetUserAuth } from '@/entity/enums'
import PSetList from '../../components/List/PSetList.vue'
import EditPsetDialog from './components/EditPsetDialog.vue'
import Page from '@/entity/Page'

export default {
  name: 'PersonalProblemSet',
  components: { PSetList, EditPsetDialog },
  data () {
    return {
      // 列表数据
      manageList: [],
      memberList: [],
      favoriteList: [],

      // 加载状态
      loading: {
        manage: false,
        member: false,
        favorite: false
      },

      // 分页配置
      pagination: {
        manage: { pageNum: 1, total: 0 },
        member: { pageNum: 1, total: 0 },
        favorite: { pageNum: 1, total: 0 }
      }
    }
  },
  created () {
    this.loadAllLists()
  },
  methods: {
    // 加载所有列表
    async loadAllLists () {
      await Promise.all([
        this.loadList('manage', PSetUserAuth.Manage),
        this.loadList('member', PSetUserAuth.Member),
        this.loadList('favorite', PSetUserAuth.Favorite)
      ])
    },

    // 加载单个列表
    async loadList (type, authority) {
      this.loading[type] = true
      try {
        const page = new Page(this.pagination[type].pageNum)

        const response = await loadByAuth(page, authority)

        this[`${type}List`] = response.data.list || []
        this.pagination[type].total = response.data.total || 0
      } catch (error) {
        console.error(`获取${type}列表失败:`, error)
        this.$message.error(`${this.getTypeName(type)}列表加载失败`)
      } finally {
        this.loading[type] = false
      }
    },

    handlePageChange (type, newPage) {
      this.pagination[type].pageNum = newPage
      this.loadList(type, this.getAuthority(type))
    },

    handleItemClick (row) {
      this.$router.push(`/pset/${row.id}`)
    },

    getAuthority (type) {
      const authMap = {
        manage: PSetUserAuth.Manage,
        member: PSetUserAuth.Member,
        favorite: PSetUserAuth.Favorite
      }
      return authMap[type]
    },

    getTypeName (type) {
      const names = {
        manage: '管理',
        member: '参与',
        favorite: '收藏'
      }
      return names[type] || ''
    },

    handleCreatePset () {
      this.$refs.createDialog.open()
    },

    // 处理创建提交
    async handleCreateSubmit (formData) {
      try {
        await addPSet(formData)

        this.$message.success('题集创建成功')
        this.$refs.createDialog.close()

        // 刷新管理列表
        this.loadList('manage', PSetUserAuth.Manage)
      } catch (error) {
        this.$message.error('创建失败: ' + error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.personal-pset-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.section-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  padding: 24px;
}

.section-title {
  color: #303133;
  font-size: 20px;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.sub-section {
  margin: 20px 0;

  & + .sub-section {
    border-top: 1px dashed #ebeef5;
    padding-top: 20px;
  }
}

.sub-title {
  color: #606266;
  font-size: 16px;
  margin: 0 0 16px;
}

.create-button-container {
  margin-bottom: 24px;
  text-align: right;

  .el-button {
    padding: 12px 24px;
    font-size: 14px;

    i {
      margin-right: 8px;
    }
  }
}
</style>
