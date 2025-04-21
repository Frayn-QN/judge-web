<template>
  <el-form ref="form"
           :model="formData"
           label-width="120px">
    <!-- 不可编辑字段 -->
    <el-form-item v-if="showSerial"
                  label="题目编号">
      <el-input v-model="formData.serial"
                disabled />
    </el-form-item>

    <!-- 基础信息 -->
    <el-form-item label="题目名称"
                  prop="name"
                  required>
      <el-input v-model="formData.name" />
    </el-form-item>

    <el-form-item label="难度等级"
                  prop="level"
                  required>
      <el-select v-model="formData.level">
        <el-option v-for="(value, key) in ProblemLevel"
                   :key="key"
                   :label="value"
                   :value="value" />
      </el-select>
    </el-form-item>

    <!-- 题目内容 -->
    <el-form-item label="题目描述"
                  prop="content"
                  required>
      <el-input v-model="formData.content"
                type="textarea"
                :rows="5" />
    </el-form-item>

    <!-- 文件管理 -->
    <file-manager label="测试用例"
                  :files="formData.example"
                  extension=".in"
                  @add="handleAddExample"
                  @remove="handleRemoveExample" />

    <file-manager label="预期输出"
                  :files="formData.expectation"
                  extension=".out"
                  @add="handleAddExpectation"
                  @remove="handleRemoveExpectation" />

    <file-manager label="附加文件"
                  :files="formData.extra"
                  @add="handleAddExtra"
                  @remove="handleRemoveExtra" />

    <!-- 语言选择 -->
    <el-form-item label="支持语言"
                  prop="language"
                  required>
      <el-checkbox-group v-model="formData.language">
        <el-checkbox v-for="(value, key) in Language"
                     :key="key"
                     :label="value"
                     :disabled="checkLanguageDisabled(value)">
          {{ value }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <!-- 限制参数 -->
    <el-form-item label="时间限制（ms）"
                  prop="timeLimit"
                  required>
      <el-input-number v-model="formData.timeLimit"
                       :min="100" />
    </el-form-item>

    <el-form-item label="内存限制（MB）"
                  prop="memoryLimit"
                  required>
      <el-input-number v-model="formData.memoryLimit"
                       :min="10" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 @click="handleSubmit">提交修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Language, ProblemLevel } from '@/entity/enums'
import FileManager from './FileManager.vue'

export default {
  name: 'ProblemForm',
  components: { FileManager },
  props: {
    initData: {
      type: Object,
      required: true
    },
    showSerial: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formData: { ...this.initData },
      Language,
      ProblemLevel
    }
  },
  watch: {
    initData: {
      handler (val) {
        this.formData = { ...val }
      },
      deep: true
    }
  },
  methods: {
    checkLanguageDisabled (lang) {
      if (this.formData.language.length === 0) return false

      const hasVerilog = this.formData.language.includes(Language.Verilog)
      const isVerilog = lang === Language.Verilog
      return hasVerilog ? !isVerilog : isVerilog
    },

    handleAddExample (file) {
      this.formData.example.push(file)
    },

    handleRemoveExample (fileName) {
      this.formData.example = this.formData.example.filter(
        f => f.fileName !== fileName
      )
    },

    handleAddExpectation (file) {
      this.formData.expectation.push(file)
    },

    handleRemoveExpectation (fileName) {
      this.formData.expectation = this.formData.expectation.filter(
        f => f.fileName !== fileName
      )
    },

    handleAddExtra (file) {
      this.formData.extra.push(file)
    },

    handleRemoveExtra (fileName) {
      this.formData.extra = this.formData.extra.filter(
        f => f.fileName !== fileName
      )
    },

    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const submitData = {
            ...this.formData,
            example: this.formatFileList(this.formData.example),
            expectation: this.formatFileList(this.formData.expectation),
            extra: this.formatFileList(this.formData.extra)
          }
          this.$emit('submit', submitData)
        }
      })
    },

    formatFileList (files) {
      return files.map(file => ({
        [file.fileName]: file.content
      }))
    }
  }
}
</script>
