<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table  :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"  border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-sizes="[8, 10, 20, 30]"
        :page-size="pagesize"
        background
        layout="total, prev, pager, next"
        align="center"
        :total="total">
      </el-pagination>
      <el-button  v-show="total>0"  align="right" :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleSubmit">
        确认导入
      </el-button>
    </div>
  </div>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {importUser} from "@/api/user";

export default {
  name: '',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      currentData: [],
      pagesize: 8,
      total: 0,
      currentPage: 1
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
      this.tableData = results
      this.tableHeader = header
      this.total = results.length
      //console.log(this.tableData)
    },
    // 将数据提交至数据库
    async handleSubmit(){
      //生成传递给后端的json数组
      let userList = []
      for (let item of this.tableData) {
        let user = {}
        user.userIndex = item.序号
        user.userId = item.用户账号
        user.userPassword = item.初始密码
        user.userName = item.用户名
        user.roleId = item.用户角色
        userList.push(user)
      }
      //将userList传入后端
      const importData = {}
      importData.userList = userList
      await importUser(importData)
      this.$message({
        type: 'success',
        message: '更新成功!'
      })

    },
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }

  }
}
</script>
<style>

</style>
