<template>
  <div class="dashboard-container">
    <el-row class="welcome-row">
      <el-col :span="24">
        <h1 class="welcome-text">欢迎，{{ username }}！</h1>
      </el-col>
    </el-row>

    <!-- 公告组件 -->
    <announcement />

    <!-- 统计组件 -->
    <statistic />
  </div>
</template>

  <script>
import { mapGetters } from 'vuex'
import Announcement from './Announcement'
import Statistic from './Statistic'

export default {
  name: 'Dashboard',
  components: {
    Announcement,
    Statistic
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  }
}
  </script>

  <style lang="scss" scoped>
.dashboard-container {
  padding: 30px;
  background: #fff;
  min-height: 100vh;
}

.welcome-text {
  font-size: 28px;
  color: #000;
  margin: 0 0 40px 0;
  font-weight: normal;
}
</style>
