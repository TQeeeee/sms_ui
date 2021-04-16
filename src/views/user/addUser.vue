<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="index" type="index" align="center" width="80" :index="makeIndex">
      </el-table-column>
      <el-table-column label="用户Id" prop="userId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="userName" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" prop="roleId" align="center" width="130">
        <template slot-scope="{row}">
          <span v-if="row.roleId === 1" style="color: #13ce66">管理员</span>
          <span v-else-if="row.roleId === 2" style="color: #f7a345">辅导员</span>
          <span v-else style="color: #212121">学生</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="confirmed" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.confirmed | statusFilter">
            {{ row.confirmed | confirmFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"style="margin-right: 10px">
            Edit
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认要删除该条记录吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">Delete</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="temp.userId" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="初始密码" prop="userPassword">
          <el-input v-model="temp.userPassword" />
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId">
          <el-select v-model="temp.roleId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleNameOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const roleNameOptions = [
  { roleId: 1, roleName: '管理员' },
  { roleId: 2, roleName: '辅导员' },
  { roleId: 3, roleName: '学生' }
]

export default {
  name: 'AddUser',
  components: { Pagination },
  filters: {
    statusFilter(confirmed) {
      if (confirmed === 1) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    roleFilter(roleId) {
      const roleMap = {
        1: '管理员',
        2: '学生',
        3: '辅导员'
      }
      return roleMap[roleId]
    },
    confirmFilter(confirmed) {
      const confirmMap = {
        1: '已确认',
        0: '未确认'
      }
      return confirmMap[confirmed]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userName: undefined
      },
      // 添加或更改用户所需的数据栏
      temp: {// undefined是真正的啥也没有
        userId: '',
        userName: '',
        userPassword: '',
        roleId: 1,
        confirmed: undefined
      },
      roleNameOptions,
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        userId: [{ required: true, message: 'userId is required', trigger: 'change' }],
        userName: [{ required: true, message: 'userName is required', trigger: 'change' }],
        userPassWord: [{ required: true, message: 'Password is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    // this.list = [{ 'userIndex': 1, 'userName': 'ttq', 'userId': '01', 'roleId': 1, 'isConfirmed': 1 },
    //   { 'userIndex': 2, 'userName': 'ttqq', 'userId': '02', 'roleId': 2, 'isConfirmed': 0 }]
    // this.total = 2
    // this.listLoading = false
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    makeIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        userId: '',
        userName: '',
        userPassword: '',
        roleId: 1,
        isConfirmed: undefined
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 此处还可以再更改temp的内容
          this.temp.confirmed = 0
          createUser(this.temp).then(() => {
            // 添加成功后无需再次获取后端数据，直接在前端页面添加
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.userPassword = ''
      this.dialogStatus = 'update' // 根据userIndex更改用户信息
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // 可以更改某些字段
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.userId === this.temp.userId) // userIndex是永远不会变的X
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      // copy the row
      deleteUser(row.userId).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      }).catch(err => { console.error(err) })
    }

  }
}
</script>
