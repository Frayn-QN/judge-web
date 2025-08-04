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

    <!-- 按语言分组的附加文件 -->
    <div v-for="lang in formData.language"
         :key="lang">
      <file-manager :label="`${lang}附加文件`"
                    :files="formData.extra[lang] || []"
                    @add="handleAddExtra(lang, $event)"
                    @remove="handleRemoveExtra(lang, $event)" />
    </div>

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
                 @click="handleSubmit">提交</el-button>
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
        // 保留已修改的表单数据
        const mergedData = {
          ...this.deepClone(val),
          // 保留用户已做的修改
          name: this.formData.name || val.name,
          level: this.formData.level || val.level,
          content: this.formData.content || val.content,
          language: this.formData.language || val.language,
          extra: this.formData.extra || val.extra
        }
        this.formData = mergedData
      },
      deep: true
    },
    'formData.language': {
      handler (newVal) {
        this.syncExtraStructure(newVal)
      },
      deep: true
    }
  },

  methods: {
    deepClone (obj) {
      const cache = new WeakMap()
      const clone = val => {
        if (val === null || typeof val !== 'object') return val
        if (cache.has(val)) return cache.get(val)

        const result = Array.isArray(val)
          ? val.map(clone)
          : Object.fromEntries(Object.entries(val).map(([k, v]) => [k, clone(v)]))

        cache.set(val, result)
        return result
      }
      return clone(obj)
    },

    syncExtraStructure (languages = this.formData.language) {
      const newExtra = languages.reduce((acc, lang) => {
        acc[lang] = this.formData.extra[lang] || []
        return acc
      }, {})
      this.formData.extra = { ...newExtra, ...this.formData.extra }
    },

    checkLanguageDisabled (lang) {
      if (this.formData.language.length === 0) return false

      const hasVerilog = this.formData.language.includes(Language.Verilog)
      const isVerilog = lang === Language.Verilog
      return hasVerilog ? !isVerilog : isVerilog
    },

    isFileNameDuplicate (fileName, fileList) {
      return fileList.some(file => file.fileName === fileName)
    },

    handleBatchAdd (target, files) {
      const duplicates = files.filter(file =>
        this.isFileNameDuplicate(file.fileName, this.formData[target])
      )

      if (duplicates.length > 0) {
        this.$message.error(`发现 ${duplicates.length} 个重复文件`)
        return
      }

      this.formData[target] = [...this.formData[target], ...files]
      this.maintainDataConsistency()
    },

    handleAddExample (files) {
      this.handleBatchAdd('example', files)
    },

    handleAddExpectation (files) {
      this.handleBatchAdd('expectation', files)
    },

    handleAddExtra (lang, files) {
      const current = this.formData.extra[lang] || []
      this.$set(this.formData.extra, lang, [...current, ...files])
      this.maintainDataConsistency()
    },

    maintainDataConsistency () {
      this.$nextTick(() => {
        this.syncExtraStructure()
        this.$forceUpdate()
      })
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

    handleRemoveExtra (lang, fileName) {
      const files = this.formData.extra[lang] || []
      this.$set(
        this.formData.extra,
        lang,
        files.filter(f => f.fileName !== fileName)
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
            extra: Object.keys(this.formData.extra).reduce((acc, lang) => {
              acc[lang] = this.formatFileList(this.formData.extra[lang])
              return acc
            }, {})
          }

          this.$emit('submit', submitData)
        }
      })
    },

    // 验证名称列表是否一致
    areNamesEqual (a, b) {
      return a.length === b.length &&
        a.every((name, idx) => name === b[idx])
    },

    // 处理文件排序和重命名
    processFiles (files, ext, sortedNames) {
      // 创建文件副本
      const filesCopy = files.map(f => ({ ...f }))

      // 按原始名称排序
      filesCopy.sort((a, b) => {
        return a.fileName.localeCompare(b.fileName, undefined, { numeric: true })
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
