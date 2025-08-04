<template>
  <el-dialog title="修改用户权限"
             :visible.sync="visible"
             width="400px">
    <el-form>
      <el-form-item label="当前用户">
        <div>{{ currentUser.username }}</div>
      </el-form-item>
      <el-form-item label="新权限等级">
        <el-select v-model="selectedAuthority">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="handleSubmit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { UserAuth } from '@/entity/enums'

export default {
  data () {
    return {
      visible: false,
      currentUser: {},
      selectedAuthority: '',
      options: [
        { value: UserAuth.User, label: '用户' },
        { value: UserAuth.Coach, label: '教练' }
        // { value: UserAuth.Admin, label: '管理员' }
      ]
    }
  },
  methods: {
    open (user) {
      this.currentUser = user
      this.selectedAuthority = user.authority
      this.visible = true
    },
    handleSubmit () {
      this.$emit('submit', this.currentUser.id, this.selectedAuthority)
      this.visible = false
    }
  }
}
  </script>
