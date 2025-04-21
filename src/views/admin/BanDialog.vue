<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="visible"
             width="400px"
             @closed="handleClose">
    <div v-if="isBanned"
         class="unban-confirm">
      <i class="el-icon-warning" />
      <span>确认要解除该用户的封禁状态吗？</span>
    </div>

    <el-select v-else
               v-model="banTime"
               placeholder="请选择封禁时长"
               class="full-width">
      <el-option v-for="item in banOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value" />
    </el-select>

    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="handleConfirm">
        {{ confirmButtonText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { BanTime } from '@/entity/enums'

export default {
  data () {
    return {
      visible: false,
      userID: '',
      isBanned: false,
      banTime: '',
      banOptions: [
        { label: '1天', value: BanTime.BAN_1Day },
        { label: '7天', value: BanTime.BAN_7Days },
        { label: '30天', value: BanTime.BAN_30Days },
        { label: '永久', value: BanTime.BAN_Permanent }
      ]
    }
  },
  computed: {
    dialogTitle () {
      return this.isBanned ? '解封用户' : '封禁用户'
    },
    confirmButtonText () {
      return this.isBanned ? '确认解封' : '确认封禁'
    }
  },
  methods: {
    open (userID, isBanned) {
      this.visible = true
      this.userID = userID
      this.isBanned = isBanned
      // 自动设置解封参数
      if (this.isBanned) {
        this.banTime = BanTime.BAN_Unban
      }
    },

    handleConfirm () {
      this.$emit('ban', this.userID, this.banTime)
      this.visible = false
    },

    handleClose () {
      // 重置为默认状态
      this.banTime = ''
      this.isBanned = false
    }
  }
}
</script>

<style lang="scss" scoped>
.full-width {
  width: 100%;
}

.unban-confirm {
  text-align: center;
  padding: 20px 0;

  .el-icon-warning {
    color: #e6a23c;
    font-size: 24px;
    margin-right: 8px;
  }

  span {
    vertical-align: middle;
  }
}
</style>
