<template>
  <el-card class="code-editor-box">
    <div slot="header"
         class="editor-header">
      <span class="panel-title">答题区</span>
      <el-select v-model="currentLanguage"
                 placeholder="选择语言"
                 class="language-select"
                 :disabled="!hasLanguages"
                 @change="handleLanguageChange">
        <el-option v-for="lang in availableLanguages"
                   :key="lang.key"
                   :label="lang.label"
                   :value="lang.key" />
      </el-select>
    </div>

    <codemirror ref="cmEditor"
                v-model="codeContent"
                :options="editorOptions"
                class="code-mirror" />

    <div class="submit-area">
      <el-button type="primary"
                 :loading="submitting"
                 :disabled="!hasLanguages"
                 @click="handleCodeSubmit">
        提交代码
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
// 自动补全
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/anyword-hint'
// 括号补全
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/mode/clike/clike.js' // C/C++/Java
import 'codemirror/mode/python/python.js' // Python
import 'codemirror/mode/lua/lua.js' // Lua
import 'codemirror/mode/verilog/verilog.js' // Verilog

import { LANGUAGE_CONFIG, DEFAULT_LANGUAGES } from '@/entity/languages'
import { Language } from '@/entity/enums'
import Task from '@/entity/Task'

export default {
  name: 'Editor',
  components: { codemirror },
  props: {
    problemId: {
      type: String,
      required: true
    },
    languages: {
      type: Array,
      default: () => DEFAULT_LANGUAGES,
      validator: value =>
        value.every(lang => Object.values(Language).includes(lang))
    }
  },
  data () {
    return {
      codeContent: '',
      currentLanguage: null,
      editorOptions: {
        tabSize: 4,
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true, // 启用自动闭合括号
        electricChars: true, // 启用智能缩进
        smartIndent: true,
        indentUnit: 4, // 缩进单位设为4
        extraKeys: { 'Ctrl-Space': 'autocomplete' }
      },
      submitting: false
    }
  },
  computed: {
    // 处理可用语言选项
    availableLanguages () {
      return this.languages.map(lang => ({
        key: lang,
        ...LANGUAGE_CONFIG[lang]
      })).filter(item => item.mode) // 过滤无效配置
    },

    currentLangConfig () {
      return LANGUAGE_CONFIG[this.currentLanguage] || {}
    },

    hasLanguages () {
      return this.languages.length > 0
    }
  },
  watch: {
    languages: {
      immediate: true,
      handler (newVal) {
        if (newVal.length > 0) {
          this.currentLanguage = newVal.includes(this.currentLanguage)
            ? this.currentLanguage
            : newVal[0]
          this.updateEditorMode()
          this.loadCodeTemplate()
        }
      }
    }
  },
  methods: {
    updateEditorMode () {
      this.editorOptions.mode = this.currentLangConfig.mode
      this.$nextTick(() => {
        this.$refs.cmEditor.codemirror.refresh()
      })
    },

    // 加载代码模板
    loadCodeTemplate () {
      this.codeContent = this.currentLangConfig.template || ''
    },

    handleLanguageChange () {
      this.updateEditorMode()
      this.loadCodeTemplate()
    },

    async handleCodeSubmit () {
      if (!this.codeContent.trim()) {
        this.$message.warning('请先编写代码')
        return
      }

      this.submitting = true
      try {
        const task = new Task(
          this.problemId,
          this.currentLanguage,
          this.codeContent,
          true
        )

        this.$emit('submit', task)
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败，请检查网络')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.code-editor-box {
  margin-top: 20px;

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .code-mirror {
    height: 500px;
    border: 1px solid #ebeef5;
    border-radius: 4px;

    ::v-deep .CodeMirror {
      height: 500px;
      font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
      font-size: 18px;
      line-height: 1.5;

      // 补全框
      .CodeMirror-hints {
        min-width: 200px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .CodeMirror-hint {
          padding: 8px 12px;
          &:hover {
            background: #f5f7fa;
          }
        }
      }
      // 光标
      .CodeMirror-cursor {
        border-left: 3px solid #409eff;
      }
    }
  }

  .submit-area {
    margin-top: 15px;
    text-align: right;
  }

  .language-select {
    width: 150px;
  }
}
</style>
