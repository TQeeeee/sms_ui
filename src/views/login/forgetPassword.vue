<template>
  <div class="login-container">
    <el-form ref="ForgetForm" :model="user" :rules="ForgetRules" class="login-form" label-position="left">
      <div class="title-container">
        <h3 class="title">申请重置密码</h3>
      </div>

      <!--      删除了-->
      <el-form-item prop="userId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userId"
          v-model="user.userId"
          placeholder="用户账号"
          name="userId"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleSendEmail">SendEmail</el-button>

      <div class="forgetpassword">
        <router-link to="/login">返回登录</router-link>
      </div>
    </el-form>

  </div>
</template>

<script>
import { validateNotnull } from '@/utils/validate'
import { sendEmail } from '@/api/auth'

export default {
  name: 'ForgetPassword',
  data() {
    return {
      loading: false,
      user: {
        userId: ''
      },
      ForgetRules: {
        userId: [{ required: true, trigger: 'blur', validator: validateNotnull }]
      }
    }
  },
  methods: {
    handleSendEmail() {
      this.loading = true
      sendEmail(this.user).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            message: '发送成功，待审核',
            type: 'success',
            duration: 1500
          })
        }
        setTimeout(() => {
          this.loading = false
        }, 1500)
      }).catch((response) => {
        this.$notify({
          message: response.data,
          type: 'failed',
          duration: 1500
        })
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }
  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
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
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .forgetpassword{
    position: relative;
    color: #2e90f4f5;
    text-align: right;
    font-weight: bold;
  }

  .login-container {
    min-height: 100%;
    width: 100%;
    background: url("../../assets/background/wpBlue2.jpg") no-repeat center;
    background-position: 0px -15;
    //background-image: url("../../assets/background/wpBlue.jpg") no;
    background-size: cover;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 265px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: #2e90f4f5;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
