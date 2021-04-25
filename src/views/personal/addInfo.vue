<template>
  <div class="app-container">
    <el-card v-if="confirmed === 0" v-loading="listLoading" style="margin-bottom: 20px">
      <div slot="header" class="clearfix" :gutter="20">
        <span :align="center">创建个人信息（慎重：仅可创建一次）</span>
      </div>
      <Account :user="baseInfo" :majors="majors" @handleSubmit="handleCreate" />
    </el-card>
    <el-card v-else>
      <div class="clearfix">
        <span style="margin: 0 auto;">你已创建完成个人信息 </span>
      </div>
    </el-card>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getMajorList } from '@/api/major'
import { createTeacher } from '../../api/teacher'
import { createStudent } from '../../api/student'
import Account from './components/Account'

export default {
  name: 'AddInfo',
  computed: {
    ...mapGetters([
      'userId',
      'roleId',
      'confirmed'
    ])
  },
  components: { Account },
  data() {
    return {
      listLoading: true,
      baseInfo: {
        actualName: '',
        telephone: undefined,
        address: '',
        gender: '女',
        emailAddress: '',
        age: 18
      },
      // 只要用户是student就需要向后端发请求获取majorId
      majors: [] // major:[{"majorId": 2,"majorName":}]
      // userInfo: {
      //   user_id: this.userId,
      //   role_id: this.roleId
      // },

    }
  },
  created() {
    this.createBasInfo()
  },
  methods: {
    createBasInfo() {
      this.listLoading = true
      if (this.$store.getters.roleId === 3) {
        // 获取专业信息,由于在request.js里面已经定义了promise,所以在这里的函数结果可以直接.then,
        getMajorList().then(response => {
          this.majors = response.data.items
          // 然后怎样把专业渲染到页面上？？
          setTimeout(() => {
            this.listLoading = false
          }, 1500)
        })
      } else {
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      }
    },
    handleCreate(majorId) {
      // 生成向后端发送的数据
      this.listLoading = true
      let tempData = {}
      tempData = Object.assign({}, this.baseInfo)
      if (this.roleId === 2) { // 如果是教师角色
        tempData.teacherId = this.userId
        createTeacher(tempData).then((res) => {
          // 发送消息？创建成功？
          if (res.code === 20000) {
            this.$notify({
              message: '创建成功，待审核',
              type: 'success',
              duration: 1500
            })
            this.$store.dispatch('user/userConfirm')
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1500)
        }).catch(() => {
          this.$notify({
            message: '创建失败',
            type: 'warning',
            duration: 1500
          })
        })
      } else { // 如果是学生角色
        tempData.studentId = this.userId
        tempData.majorId = majorId
        console.log(tempData)
        createStudent(tempData).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              message: '添加成功！',
              type: 'success'
            })
            this.$store.dispatch('user/userConfirm')
          } else {
            this.$message('添加失败')
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1000)
        })
      }
    },

    refreshPage() {
      this.baseInfo = {
        actualName: '',
        telephone: undefined,
        address: '',
        gender: '女',
        age: 0
      }
      this.majorId = ''
      this.majors = []
    }
  }
}
</script>

<style scoped>

</style>
