<template>
  <el-dialog :title="title"
             :visible.sync="visible"
             width="600px"
             @close="handleClose">
    <el-form ref="formRef"
             :model="form"
             :rules="rules"
             label-width="80px">
      <el-form-item label="标题"
                    prop="name">
        <el-input v-model="form.name"
                  placeholder="请输入题集标题"
                  maxlength="50"
                  show-word-limit />
      </el-form-item>
      <el-form-item label="介绍"
                    prop="introduction">
        <el-input v-model="form.introduction"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入题集描述"
                  maxlength="500"
                  show-word-limit />
      </el-form-item>
      <el-form-item label="状态"
                    prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="PUBLIC">公开</el-radio>
          <el-radio label="PRIVATE">私有</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary"
                 :loading="submitting"
                 @click="handleSubmit">
        保 存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { PSetStatus } from '@/entity/enums'

export default {
  props: {
    title: {
      type: String,
      default: '编辑题集'
    },
    initialData: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        introduction: '',
        status: PSetStatus.Public
      })
    }
  },
  data () {
    return {
      visible: false,
      form: { ...this.initialData },
      submitting: false,
      rules: {
        name: [
          { required: true, message: '请输入题集标题', trigger: 'blur' },
          { max: 50, message: '标题长度不能超过50个字符', trigger: 'blur' }
        ],
        introduction: [
          { max: 500, message: '描述长度不能超过500个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    initialData: {
      immediate: true,
      deep: true,
      handler (newVal) {
        this.form = { ...newVal }
      }
    }
  },
  methods: {
    handleClose () {
      this.$refs.formRef.resetFields()
    },

    open () {
      this.form = { // 重置表单数据
        name: '',
        introduction: '',
        status: 'PUBLIC'
      }
      this.visible = true
    },

    close () {
      this.visible = false
    },

    async handleSubmit () {
      try {
        const valid = await this.$refs.formRef.validate()
        if (!valid) return

        this.submitting = true
        this.$emit('submit', this.form)
      } catch (error) {
        console.error('表单验证失败:', error)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
