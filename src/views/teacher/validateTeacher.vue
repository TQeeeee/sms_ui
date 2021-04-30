<template>
  <div class="app-container">
    <h>这里是审核辅导员注册信息</h>
    <div class="filter-container">
      <el-input v-model="listQuery.teacher.teacherId" placeholder="工号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.teacher.actualName" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
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
      <el-table-column label="序号" prop="index" type="index" align="center" width="80" :index="makeIndex" />
      <el-table-column label="工号" prop="studentId" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.teacherId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="actualName" align="center" min-width="90">
        <template slot-scope="{row}">
          <span>{{ row.actualName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="telephone" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" prop="emailAddress" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.emailAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="start" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" style="margin-right: 10px" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button type="success" size="mini" @click="handleConfirm(row)">
            Confirm
          </el-button>
          <el-button type="warning" size="mini" @click="handleDetail(row)">
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="readonly?'Detail':'Edit'" :visible.sync="dialogFormVisible">
      <!--        由于这里只做显示用，因此用一个v-for将数据全部显示出来-->
      <el-form ref="dataForm" :rules="rules" :model="tempTeacher" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="真实姓名" prop="actualName">
          <el-input v-model="tempTeacher.actualName" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="tempTeacher.gender" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="年龄" prop="age" :autosize="{ minRows: 2, maxRows: 4}" type="textarea">
          <el-input v-model="tempTeacher.age" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="address" :autosize="{ minRows: 2, maxRows: 4}" type="textarea">
          <el-input v-model="tempTeacher.address" :readonly="readonly" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button v-if="!readonly" type="primary" @click="updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { getAllTeacher, updateTeacher } from '../../api/teacher'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ValidateTeacher',
  components: { Pagination },
  data() {
    return {
      readonly: true,
      dialogFormVisible: false,
      total: 0,
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        teacher: {
          teacherId: undefined,
          actualName: undefined,
          valided: 0 // 获取所有待审核的老师
        }
      },
      displayTeacher: {},
      tempTeacher: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAllTeacher(this.listQuery).then((res) => {
        if (res.code === 20000) {
          this.list = res.data.items
          this.total = res.data.total
        } else {
          this.$notify({
            message: '查询失败',
            type: 'warning'
          })
        }
      })
      setTimeout(() => {
        this.refreshQuery()
        this.listLoading = false
      }, 500)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    refreshQuery() {
      this.listQuery.teacher.teacherId = undefined
      this.listQuery.teacher.actualName = undefined
    },
    makeIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    handleUpdate(row) {
      this.readonly = false
      this.tempTeacher = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    handleConfirm(row) {
      this.tempTeacher = Object.assign({}, row)
      this.tempTeacher.valided = 1
      this.updateData()
    },
    handleDetail(row) {
      this.readonly = true
      this.tempTeacher = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    updateData() {
      // 管理员修改了就相当于审核通过了
      this.tempTeacher.valided = 1
      const tempData = Object.assign({}, this.tempTeacher)
      // 更新后台数据
      updateTeacher(tempData).then((res) => {
        if (res.code === 20000) {
          const index = this.list.findIndex(v => v.teacherId === this.tempTeacher.teacherId) // userIndex是永远不会变的X
          // 把该用户从当前待审核列表中删除
          this.list.splice(index, 1)
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$message('更新失败！')
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
