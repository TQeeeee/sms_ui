<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table
      v-if="total > 0"
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      border
      fit
      highlight-current-row
      style="width: 100%;margin: 20px"
    >
      <el-table-column label="用户账号" prop="userId" align="center" width="200">
        <template slot-scope="{row}">
          <span v-if="editing === row.userId">
            <el-input v-model="row.userId" type="text" />
          </span>
          <span v-else>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="userName" align="center" width="200">
        <template slot-scope="{row}">
          <span v-if="editing === row.userId">
            <el-input v-model="row.userName" type="text" />
          </span>
          <span v-else>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="初始密码" prop="userPassword" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="editing === row.userId">
            <el-input v-model="row.userPassword" type="text" />
          </span>
          <span v-else>{{ row.userPassword }}</span>
        </template>
      </el-table-column>
      <!--      这个比较复杂，要进行过滤-->
      <el-table-column label="用户角色" prop="roleId" align="center" min-width="80">
        <template slot-scope="{row}">
          <span v-if="editing === row.userId">
            <el-select v-model="row.roleId" class="filter-item" placeholder="Please select">
              <el-option v-for="item in roleNameOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </span>
          <span v-else>{{ row.roleId | roleFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="total > 0" label="操作" align="center" min-width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="editing !== row.userId" type="success" size="mini" @click="handleEdit(row)">
            Edit
          </el-button>
          <el-button v-if="editing === row.userId" type="success" size="mini" @click="handleCancel(row)">
            Cancel
          </el-button>
          <el-button v-if="editing === row.userId" type="warning" size="mini" @click="handleConfirm(row)">
            Confirm
          </el-button>
          <el-button v-if="editing !== row.userId" type="danger" size="mini" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[8, 15, 20, 30]"
        :page-size="pagesize"
        background
        layout="total, prev, pager, next"
        align="center"
        :total="total"
        style="margin-bottom: 20px"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
      <el-button v-if="total>0" :align="center" :loading="loading" style="margin-left:16px;" type="primary" @click="handleSubmit">
        确认导入
      </el-button>
    </div>
  </div>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { importUser } from '@/api/user'

const roleIdMap = {
  '管理员': 1,
  '辅导员': 2,
  '学生': 3
}
const roleNameOptions = [
  { roleId: 1, roleName: '管理员' },
  { roleId: 2, roleName: '辅导员' },
  { roleId: 3, roleName: '学生' }
]

export default {
  name: '',
  components: { UploadExcelComponent },
  filters: {
    roleFilter(roleId) {
      const roleMap = {
        1: '管理员',
        2: '辅导员',
        3: '学生'
      }
      return roleMap[roleId]
    }
  },
  data() {
    return {
      tableData: [], // 将解析好的Table加工一下
      tableHeader: [],
      currentData: [],
      pagesize: 20,
      total: 0,
      currentPage: 1,
      // 代表当前正在编辑的id
      editing: null,
      roleIdMap,
      roleNameOptions,
      temp: {}
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传超过1M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      for (const item of results) {
        const user = {}
        user.userId = item.用户账号
        user.userName = item.用户名
        user.userPassword = item.初始密码
        user.roleId = roleIdMap[item.用户角色]
        user.confirmed = 0
        this.tableData.push(user)
      }
      this.tableHeader = header
      this.total = this.tableData.length
      // console.log(this.tableData)
    },
    // 将数据提交至数据库
    handleSubmit() {
      // 生成传递给后端的json数组
      importUser(this.tableData).then((res) => {
        // 如何根据后端返回的数据进行判断？------------------
        this.$notify({
          title: 'Success',
          message: '导入成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => { console.log(err) })
      this.$message({
        type: 'failed',
        message: '导入失败!'
      })
      this.tableData = []
      this.total = 0
      this.tableHeader = []
    },
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleDelete(row) {
      // 删除数组中的
      this.tableData = this.tableData.filter(
        item => item.userId !== row.userId
      )
    },
    handleEdit(row) {
      this.temp = Object.assign({}, row)
      this.editing = row.userId
    },
    handleCancel(row) {
      Object.assign(row, this.temp)
      this.editing = null
    },
    handleConfirm(row) {
      this.temp = {}
      this.editing = null
    }

  }
}
</script>
<style>

</style>
