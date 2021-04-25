<template>
  <!--  此处有坑，要想validate获取到值必须绑定model-->
  <el-form :rules="rules" :model="user">
    <el-form-item v-for="(value,key) of user" :key="key" :prop="key" :label="key|keyNameFilter">
      <el-input v-model.trim="user[key]" />
    </el-form-item>
    <!--    <el-form-item label="真实姓名" prop="actualName">-->
    <!--      <el-input v-model.trim="tempuser.actualName" />-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="家庭住址" prop="address">-->
    <!--      <el-input v-model="tempuser.address" />-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="电话号码" prop="telephone">-->
    <!--      <el-input v-model="tempuser.telephone" />-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="性别" prop="gender">-->
    <!--      <el-input v-model="tempuser.gender" />-->
    <!--    </el-form-item>-->
    <!--    <el-form-item label="年龄" prop="age">-->
    <!--      <el-input v-model="tempuser.age" />-->
    <!--    </el-form-item>-->
    <el-form-item v-if="majors.length > 0" style="margin: 60px 0px">
      <span style="margin-right: 20px">专业名称</span>
      <el-select v-model="majorId">
        <el-option v-for="item of majors" :key="item.majorId" :label="item.majorName" :value="item.majorId" />
      </el-select>
    </el-form-item>
    <el-form-item style="margin-top: 60px">
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validateNotnull, validatePhone, isOneToNinetyNine, validEmail } from '../../../utils/validate'

export default {
  filters: {
    keyNameFilter(key) {
      const keyNameMap = {
        'actualName': '真实姓名',
        'address': '家庭住址',
        'telephone': '电话号码',
        'gender': '性别',
        'age': '年龄',
        'emailAddress': '邮箱地址'
      }
      return keyNameMap[key]
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    },
    majors: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // tempuser: this.user,
      majorId: '',
      rules: {
        actualName: [{ required: true, trigger: 'blur', validator: validateNotnull }],
        address: [{ required: true, trigger: 'blur', validator: validateNotnull }],
        gender: [{ required: true, trigger: 'blur', validator: validateNotnull }],
        telephone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        age: [{ required: true, trigger: 'blur', validator: isOneToNinetyNine }],
        emailAddress: [{ required: true, trigger: 'blur', validator: validEmail }]
      }
    }
  },
  methods: {
    submit() {
      this.$emit('handleSubmit', this.majorId)
    }
  }
}
</script>
