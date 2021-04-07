<template>
  <div class="app-container">
    
    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.urUserName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleAssignRole(scope)">分配用户角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      角色列表<br/><br/>
      <el-checkbox-group v-model="checkedList">
        <el-checkbox v-for="(role, index) in roleList" :key="index" :label="role.rlName"></el-checkbox>
      </el-checkbox-group>
      <br/>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUserList, assignUserRoles } from '@/api/user'
import { deepClone } from '@/utils'
import { getRoles } from '@/api/role'
import checkPermission from '@/utils/permission' // 权限判断函数

const defaultUser = {
  urId: 0,
  urUserName: '',
  urSalt: '',
  introduction: '',
  avatar: '',
  name: ''
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      userList: [],
      dialogVisible: false,
      dialogTitle: '',
      roleList: [],
      checkedList: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getUserList()
    this.getRoleList()
  },
  methods: {
    checkPermission, 
    async getUserList() {
      let res = await getUserList()
      this.userList = res.data
    },
    async getRoleList() {
      let res = await getRoles()
      this.roleList = res.data
    },
    handleAssignRole(scope) {
      this.user = deepClone(scope.row)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.dialogTitle = '给 ' + scope.row.name + ' 分配角色'
      this.$nextTick(() => {
        this.checkedList.splice(0, this.checkedList.length)
        let roles = scope.row.roleList
        roles.forEach( role => {
          this.checkedList.push(role.rlName)
        })
        console.log(this.checkedList)
      })
    },
    async confirmUser() {
      this.user.roleList.splice(0, this.user.roleList.length)
      this.checkedList.forEach( rlName => {
        this.roleList.forEach( role => {
          if(rlName === role.rlName) {
            this.user.roleList.push(role)
            return
          }
        })
      })

      await assignUserRoles(this.user)
      this.getUserList()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
