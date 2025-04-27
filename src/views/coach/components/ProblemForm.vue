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

    isFileNameDuplicate (fileName, fileList) {
      return fileList.some(file => file.fileName === fileName)
    },

    handleAddExample (file) {
      if (this.isFileNameDuplicate(file.fileName, this.formData.example)) {
        this.$message.error('存在重复文件')
        return
      }
      this.formData.example.push(file)
    },

    handleAddExpectation (file) {
      if (this.isFileNameDuplicate(file.fileName, this.formData.expectation)) {
        this.$message.error('存在重复文件')
        return
      }
      this.formData.expectation.push(file)
    },

    handleAddExtra (file) {
      if (this.isFileNameDuplicate(file.fileName, this.formData.extra)) {
        this.$message.error('存在重复文件')
        return
      }
      this.formData.extra.push(file)
    },

    handleRemoveExample (fileName) {
      this.formData.example = this.formData.example.filter(
        f => f.fileName !== fileName
      )
    },

    handleRemoveExpectation (fileName) {
      this.formData.expectation = this.formData.expectation.filter(
        f => f.fileName !== fileName
      )
    },

    handleRemoveExtra (fileName) {
      this.formData.extra = this.formData.extra.filter(
        f => f.fileName !== fileName
      )
    },

    formatFileList (files) {
      return files.map(file => ({
        [file.fileName]: file.content
      }))
    },

    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 提取文件名并验证对应关系
          const exampleNames = this.formData.example.map(f =>
            f.fileName.replace(/\.in$/, '')
          ).sort()
          const expectationNames = this.formData.expectation.map(f =>
            f.fileName.replace(/\.out$/, '')
          ).sort()

          // 检查名称匹配
          if (exampleNames.length !== expectationNames.length ||
            !this.areNamesEqual(exampleNames, expectationNames)) {
            this.$message.error('测试用例和预期输出文件不匹配')
            return
          }

          // 创建副本以避免修改原始数据
          const processedExample = this.processFiles(
            this.formData.example, '.in', exampleNames
          )
          const processedExpectation = this.processFiles(
            this.formData.expectation, '.out', expectationNames
          )

          // 构建提交数据
          const submitData = {
            ...this.formData,
            testCount: exampleNames.length,
            example: this.formatFileList(processedExample),
            expectation: this.formatFileList(processedExpectation),
            extra: this.formatFileList(this.formData.extra)
          }

          this.$emit('submit', submitData)
        }
      })
    },

    // 辅助方法：验证名称列表是否一致
    areNamesEqual (a, b) {
      return a.length === b.length &&
        a.every((name, idx) => name === b[idx])
    },

    // 辅助方法：处理文件排序和重命名
    processFiles (files, ext, sortedNames) {
      // 创建文件副本
      const filesCopy = files.map(f => ({ ...f }))

      // 按原始名称排序
      filesCopy.sort((f1, f2) => {
        const name1 = f1.fileName.replace(ext, '')
        const name2 = f2.fileName.replace(ext, '')
        return sortedNames.indexOf(name1) - sortedNames.indexOf(name2)
      })

      // 重新编号文件名
      return filesCopy.map((f, idx) => ({
        ...f,
        fileName: `${idx + 1}${ext}`
      }))
    }
  }
}
</script>
