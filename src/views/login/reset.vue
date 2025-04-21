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

      <el-form-item prop="email"
                    class="email-item">
        <span class="svg-container"><svg-icon icon-class="email" /></span>
        <el-input ref="email"
                  v-model="form.email"
                  name="email"
                  placeholder="邮箱"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                  class="email-input" />

        <el-button :disabled="isCounting"
                   class="send-button"
                   @click="handleSendCode">
          {{ buttonText }}
        </el-button>
      </el-form-item>

      <el-form-item prop="verifyCode">
        <span class="svg-container"><svg-icon icon-class="example" /></span>
        <el-input ref="verifyCode"
                  v-model="form.verifyCode"
                  name="verifyCode"
                  placeholder="验证码"
                  type="text"
                  tabindex="2"
                  auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container"><svg-icon icon-class="password" /></span>
        <el-input ref="password"
                  :key="passwordType"
                  v-model="form.password"
                  name="password"
                  placeholder="新密码"
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
                  v-model="form.confirmation"
                  name="confirmation"
                  placeholder="确认密码"
                  type="password"
                  tabindex="4"
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
import { resetPassword, sendVerification, checkEmail, getPublicKey } from '@/api/account'
import User from '@/entity/User'
import JSEncrypt from 'jsencrypt'

export default {
  name: 'Reset',
  data () {
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
        this.isEmailAvailable = false
        return
      }

      if (!isValidEmail(value)) {
        callback(new Error('邮箱格式不正确'))
        this.isEmailAvailable = false
        return
      }

      this.emailCheckLoading = true
      checkEmail(value).then(response => {
        this.isEmailAvailable = response.data
        if (!response.data) {
          callback(new Error('该邮箱已被注册'))
        } else {
          callback() // 验证通过
        }
      })
        .catch(error => {
          callback(new Error('邮箱验证失败'))
        }).finally(() => {
          this.emailCheckLoading = false
        })
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
        code: undefined,
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
      loading: false,
      isEmailAvailable: false,
      emailCheckLoading: false,
      countdown: 0,
      timer: null
    }
  },

  computed: {
    isCounting () {
      return this.countdown > 0
    },
    buttonText () {
      return this.countdown > 0
        ? `(${this.countdown}s)`
        : '发送验证码'
    }
  },

  beforeDestroy () {
    // 组件销毁时清除定时器
    if (this.timer) clearInterval(this.timer)
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
          const user = new User(
            this.form.email,
            null,
            this.form.password
          )
          const code = this.form.code

          getPublicKey().then((response) => {
            const encryptor = new JSEncrypt()
            encryptor.setPublicKey(response.data)
            user.password = encryptor.encrypt(user.password)
            return resetPassword(user, code)
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
    },

    async handleSendCode () {
      try {
        if (!this.isEmailAvailable) {
          this.$message.error('请输入有效邮箱地址')
          return
        }

        await sendVerification(this.registerForm.email)
        this.$message.success('验证码已发送')

        // 开始倒计时
        this.startCountdown()
      } catch (error) {
        this.$message.error(error.message)
      }
    },

    startCountdown () {
      this.countdown = 60
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.timer)
        }
      }, 1000)
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

<style scoped>
.email-item {
  /* 表单项容器设置为相对定位 */
  position: relative;
  margin-bottom: 22px;
}

/* 输入框样式 */
.email-item .email-input {
  width: calc(100% - 140px);
  height: 48px;
  padding-left: 30px;
}

.email-item .svg-container {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  color: #889aa4;
}

/* 发送按钮样式 */
.email-item .send-button {
  position: absolute;
  right: 0;
  width: 130px;
  height: 48px;
  background: #fff !important;
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 0 4px 4px 0;
  transition: all 0.3s;
}

/* 按钮禁用状态 */
.email-item .send-button.is-disabled {
  opacity: 0.7;
  background: #f5f7fa !important;
}

/* 输入框聚焦时联动按钮边框 */
.email-item .el-input.is-active .el-input__inner {
  border-color: #409eff;
}
.email-item .el-input.is-active + .send-button {
  border-left-color: #409eff;
}
</style>
