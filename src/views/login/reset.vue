<template>
  <div class="form-container">
    <el-form ref="form"
             :model="form"
             :rules="rules"
             class="form"
             auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h3 class="title">Reset your password</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container"><svg-icon icon-class="email" /></span>
        <el-input ref="email"
                  v-model="form.email"
                  name="email"
                  placeholder="邮箱"
                  type="text"
                  tabindex="1"
                  auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container"><svg-icon icon-class="password" /></span>
        <el-input ref="password"
                  :key="passwordType"
                  v-model="form.password"
                  name="password"
                  placeholder="密码"
                  :type="passwordType"
                  tabindex="2"
                  auto-complete="on" />
        <span class="show-pwd"
              @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="confirmation">
        <span class="svg-container"><svg-icon icon-class="lock" /></span>
        <el-input ref="confirmation"
                  v-model="form.confirmation"
                  name="confirmation"
                  placeholder="确认密码"
                  type="password"
                  tabindex="3"
                  auto-complete="on"
                  @keyup.enter.native="handleReset" />
      </el-form-item>

      <el-button :loading="loading"
                 type="primary"
                 style="width: 100%; margin-bottom: 30px"
                 @click.native.prevent="handleReset">
        重置密码
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { isValidEmail, isValidPassword } from '@/utils/validate'

export default {
  name: 'Reset',
  data () {
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
      if (value !== this.form.password || value == null) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }

    return {
      form: {
        email: undefined,
        password: undefined,
        confirmation: undefined
      },
      rules: {
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

    handleReset () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('account/resetPassword', {
              email: this.form.email,
              password: this.form.password
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
  .form-container .el-input input {
    color: $cursor;
  }
}

.form-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .form {
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
