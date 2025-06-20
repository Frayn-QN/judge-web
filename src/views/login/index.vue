<template>
  <div class="login-container">
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form"
             auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h3 class="title">青鸟在线代码测评系统</h3>
        <h3 class="title">QingNiao Online Code Judge</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input ref="email"
                  v-model="loginForm.email"
                  placeholder="邮箱"
                  name="email"
                  type="text"
                  tabindex="1"
                  auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin" />
        <span class="show-pwd"
              @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-checkbox v-model="loginForm.remember"
                   class="remember">
        <span class="remember-text">记住密码</span>
      </el-checkbox>

      <el-button :loading="loading"
                 type="primary"
                 style="width: 100%; margin-bottom: 30px"
                 @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form>

    <div class="link-container">
      <el-link type="primary"
               @click.native.prevent="toRegister">
        注册账号
      </el-link>
      <div class="divider" />
      <el-link type="primary"
               @click.native.prevent="toReset">
        修改密码
      </el-link>
    </div>
  </div>
</template>

<script>
import { isValidEmail, isValidPassword } from '@/utils/validate'

export default {
  name: 'Login',
  data () {
    // 邮箱检测
    const validateEmail = (rule, value, callback) => {
      if (!isValidEmail(value)) {
        callback(new Error('请输入正确的邮箱！'))
      } else {
        callback()
      }
    }
    // 密码检测
    const validatePassword = (rule, value, callback) => {
      if (value == null) {
        callback(new Error('密码不能为空！'))
      } else if (!isValidPassword(value)) {
        callback(new Error('密码格式错误！'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        email: undefined,
        password: undefined,
        remember: false
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 对应@/store/user
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((error) => {
              this.loading = false
              console.log(error)
              return false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    toRegister () {
      this.$router.push({ path: '/register' })
    },

    toReset () {
      this.$router.push({ path: '/reset' })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .link-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    margin-top: 5px;
  }

  .divider {
    border-left: 1px solid #dcdfe6; /* 分隔线颜色 */
    justify-content: center;
    height: 16px;
    margin: 0 15px;
  }

  .remember {
    margin: 0 0 20px 10px;
  }
}
</style>
