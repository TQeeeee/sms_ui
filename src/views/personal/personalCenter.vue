<template>
  <div class="app-container">
    <div v-if="confirmed === 0">
      <el-card>
        <div class="clearfix">
          <span style="margin: 0 auto;">请先完善个人信息 </span>
        </div>
      </el-card>
    </div>
    <div v-else-if="valid === false">
      <el-card>
        <div class="clearfix">
          <span style="margin: 0 auto;">个人信息还未审核 </span>
        </div>
      </el-card>
    </div>
    <div v-else>
      <el-row :gutter="20">
        <el-col v-loading="listLoading" :span="8" :xs="24">
          <user-card :user.sync="displayInfo" />
        </el-col>
        <el-col :span="16" :xs="24">
          <el-card>
            <el-tabs>
              <el-tab-pane label="更改信息" name="account">
                <account :user.sync="tempInfo" @handleSubmit="handleUpdate()" />
              </el-tab-pane>
              <el-tab-pane label="更改密码" name="updatePassword">
                <ResetPassword @reset="handleResetPassword" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import ResetPassword from './components/ResetPassword'
import { getStudentInfo, updateStudent } from '../../api/student'
import { getTeacherInfo, updateTeacher } from '../../api/teacher'
import { resetPassword } from '../../api/user'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'userId',
      'roleId',
      'confirmed'
    ])
  },
  components: {
    UserCard,
    Account,
    ResetPassword
  },
  data() {
    return {
      role: undefined,
      listLoading: true,
      displayInfo: {},
      userInfo: {}, // 不同的角色该对象中的字段不同
      tempInfo: {},
      prizeInfo: {},
      valid: false
    }
  },
  created() {
    // 根据用户角色role获取用户数据
    // 如果是学生，就要获取学生的班级，专业，年级，审核是否成功
    // 直接获取后端信息
    this.handleCreate()
  },
  methods: {
    handleCreate() {
      if (this.roleId === 2) {
        getTeacherInfo(this.userId).then((res) => {
          if (res.code === 20000) {
            this.valid = true
            this.userInfo = Object.assign({}, res.data)
            this.displayInfo = Object.assign({}, res.data)
            // 删除掉不要展示的
            delete this.displayInfo.teacherId
            delete this.displayInfo.end
            delete this.displayInfo.age
            delete this.displayInfo.valided
            // 删除掉不能更改的
            this.tempInfo = Object.assign({}, this.displayInfo)
            delete this.tempInfo.actualName
            delete this.tempInfo.gender
            delete this.tempInfo.start
          } else {
            this.valid = false
          }
        })
      } else {
        getStudentInfo(this.userId).then((res) => {
          if (res.code === 20000) {
            this.valid = true
            this.displayInfo = Object.assign({}, res.data)
            this.userInfo = Object.assign({}, res.data)
            // // 实在不懂为啥必须这样赋值
            {
              delete this.displayInfo.studentId
              delete this.displayInfo.end
              delete this.displayInfo.finished
              delete this.displayInfo.confirmed
              delete this.displayInfo.age
            }
            this.tempInfo = Object.assign({}, this.displayInfo)
            {
              delete this.tempInfo.prizeRecord
              delete this.tempInfo.actualName
              delete this.tempInfo.gender
              delete this.tempInfo.start
              delete this.tempInfo.majorId
              delete this.tempInfo.classId
              delete this.tempInfo.gradeId
            }
          } else {
            this.valid = false
          }
        })
      }
      // this.tempInfo.emailAddress = this.userInfo.emailAddress
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleUpdate() {
      const tempData = Object.assign({}, this.userInfo)
      tempData.telephone = this.tempInfo.telephone
      tempData.address = this.tempInfo.address
      tempData.emailAddress = this.tempInfo.emailAddress
      if (this.roleId === 2) {
        // 更新教师信息
        updateTeacher(tempData).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              title: 'Success',
              message: '更新成功,请刷新页面',
              type: 'success',
              duration: 2000
            })
          }
        })
      } else {
        // 更新学生信息
        updateStudent(tempData).then((res) => {
          if (res.code === 20000) {
            this.$notify({
              title: 'Success',
              message: '更新成功，请刷新页面',
              type: 'success',
              duration: 2000
            })
          }
        })
      }
    },
    handleResetPassword(newPassword) {
      // 需要带上userId,newPassword
      const resetTemp = {}
      resetTemp.userId = this.userId
      resetTemp.newPassword = newPassword
      resetPassword(resetTemp).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            message: '密码更新成功！',
            type: 'success'
          })
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
