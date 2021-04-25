<template>
  <el-form ref="resetForm" :model="resetForm" status-icon :rules="resetFormRules" label-width="100px">
    <el-form-item label="新密码" prop="newpwd">
      <el-input v-model="resetForm.newpwd" type="password" auto-complete="off" />
    </el-form-item>
    <el-form-item label="确认密码" prop="renewpwd">
      <el-input v-model="resetForm.renewpwd" type="password" auto-complete="off" />
    </el-form-item>
    <el-form-item style="margin-top: 60px">
      <el-button type="warning" @click="submit">Reset</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6 - 18个字符'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.newpwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 重置密码
      resetForm: {
        newpwd: '',
        renewpwd: ''
      },
      resetFormRules: {
        newpwd: [{ required: true, validator: validatePass, trigger: 'blur' }],
        renewpwd: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      // 由于两次输入的密码是一样的，因此只传递其中一个值即可
      this.emit('reset', this.resetForm.renewpwd)
    }
  }
}
</script>

<style scoped>

</style>
