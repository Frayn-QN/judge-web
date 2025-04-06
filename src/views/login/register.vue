<template>
  <div class="register-container">
    <el-form ref="registerForm"
             :model="registerForm"
             :rules="registerRules"
             class="register-form"
             auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h3 class="title">Sign up to QingNiao OJ</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container"><svg-icon icon-class="user" /></span>
        <el-input ref="username"
                  v-model="registerForm.username"
                  name="username"
                  placeholder="用户名"
                  type="text"
                  tabindex="1"
                  auto-complete="on" />
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container"><svg-icon icon-class="email" /></span>
        <el-input ref="email"
                  v-model="registerForm.email"
                  name="email"
                  placeholder="邮箱"
                  type="text"
                  tabindex="2"
                  auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container"><svg-icon icon-class="password" /></span>
        <el-input ref="password"
                  :key="passwordType"
                  v-model="registerForm.password"
                  name="password"
                  placeholder="密码"
                  :type="passwordType"
                  tabindex="3"
                  auto-complete="on" />
        <span class="show-pwd"
              @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="confirmation">
        <span class="svg-container"><svg-icon icon-class="lock" /></span>
        <el-input ref="confirmation"
                  v-model="registerForm.confirmation"
                  name="confirmation"
                  placeholder="确认密码"
                  type="password"
                  tabindex="4"
                  auto-complete="on"
                  @keyup.enter.native="handleRegister" />
      </el-form-item>

      <el-button :loading="loading"
                 type="primary"
                 style="width: 100%; margin-bottom: 30px"
                 @click.native.prevent="handleRegister">
        注册
      </el-button>
    </el-form>
  </div>
</template>

<script>
import {
  isValidEmail,
  isValidPassword,
  isValidUsername
} from '@/utils/validate'

export default {
  name: 'Register',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isValidUsername(value) || value == null) {
        callback(new Error('用户名只能由数字、字母、下划线组成'))
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (!isValidEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value == null) {
        callback(new Error('密码不能为空'))
      } else if (!isValidPassword(value)) {
        callback(new Error('密码格式错误'))
      } else {
        callback()
      }
    }

    const validateConfirm = (rule, value, callback) => {
      if (value !== this.registerForm.password || value == null) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }

    return {
      registerForm: {
        username: undefined,
        email: undefined,
        password: undefined,
        confirmation: undefined
      },
      registerRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        confirmation: [
          { required: true, trigger: 'blur', validator: validateConfirm }
        ]
      },
      passwordType: 'password',
      loading: false
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

    handleRegister () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('account/register', {
              email: this.registerForm.email,
              username: this.registerForm.username,
              password: this.registerForm.password
            })
            .then(() => {
              this.loading = false
              this.$router.back()
            })
            .catch((error) => {
              this.loading = false
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$dark_gray: #889aa4;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

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

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
}
</style>
