<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened"
               class="hamburger-container"
               @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container"
                   trigger="click">
        <div class="user-info">
          <span class="username">{{ username }}</span>
          <div class="avatar-wrapper">
            <img :src="avatar"
                 class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
        </div>

        <el-dropdown-menu slot="dropdown"
                          class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <router-link to="/user/info">
            <el-dropdown-item>
              个人信息
            </el-dropdown-item>
          </router-link>
          <a target="_blank"
             href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank"
             href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided
                            @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'username'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 10px;
      transition: all 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
        cursor: pointer;
      }

      .username {
        font-size: 16px;
        color: #606266;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 15px;

      .avatar-wrapper {
        margin-top: 0;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: static;
          margin-left: 4px;
          font-size: 14px;
          vertical-align: middle;
          transition: transform 0.3s;
        }

        &:hover .el-icon-caret-bottom {
          transform: rotate(180deg); // 添加hover动画
        }
      }
    }
  }
}
</style>
