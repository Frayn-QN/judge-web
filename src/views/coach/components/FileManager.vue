<template>
  <div class="file-manager">
    <div class="header">
      <span class="title">{{ label }}</span>
      <el-upload action=""
                 :show-file-list="false"
                 :before-upload="handleFileAdd">
        <el-button size="small"
                   type="primary"
                   icon="el-icon-plus">
          添加文件
        </el-button>
      </el-upload>
    </div>

    <div class="file-grid">
      <div v-for="file in files"
           :key="file.fileName"
           class="file-card">
        <div class="file-info">
          <i class="el-icon-document file-icon" />
          <span class="file-name">{{ file.fileName }}</span>
        </div>
        <el-button class="delete-btn"
                   type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click.stop="handleRemove(file.fileName)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileManager',
  props: {
    label: { type: String, default: '' },
    files: { type: Array, default: () => [] },
    extension: { type: String, default: '' }
  },
  methods: {
    handleFileAdd (file) {
      if (this.extension && !file.name.endsWith(this.extension)) {
        this.$message.error(`仅支持${this.extension}文件`)
        return false
      }

      const reader = new FileReader()
      reader.onload = e => {
        this.$emit('add', {
          fileName: file.name,
          content: e.target.result.split(',')[1] // 提取base64部分
        })
      }
      reader.readAsDataURL(file)
      return false
    },

    handleRemove (fileName) {
      this.$emit('remove', fileName)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-manager {
  margin: 16px 0;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-weight: 600;
  color: #303133;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.file-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #f8f9fa;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .delete-btn {
      opacity: 1;
    }
  }
}

.file-info {
  flex: 1;
  overflow: hidden;
}

.file-icon {
  margin-right: 8px;
  color: #409eff;
  font-size: 18px;
}

.file-name {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
