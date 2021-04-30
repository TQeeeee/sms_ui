<template>
  <div class="app-container">
    <h>这里是多条件组合查询辅导员 ----只能查看和删除，不能编辑</h>
    <div class="filter-container">
      <el-input v-model="listQuery.teacher.teacherId" placeholder="工号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.teacher.actualName" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.studentName" placeholder="学生姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="工号" prop="teacherId" align="center" min-width="150">
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
      <el-table-column label="联系电话" prop="telephone" align="center" min-width="90">
        <template slot-scope="{row}">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" prop="emailAddress" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.emailAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="start" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" size="mini" @click="handleDetail(row)">
            Detail
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="强行删除该辅导员吗？其班级将随机分配至其他辅导员"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">
              Delete
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="详细信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempTeacher" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="actualName">
          <el-input v-model="tempTeacher.actualName" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="tempTeacher.gender" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="address" :autosize="{ minRows: 2, maxRows: 4}" type="textarea">
          <el-input v-model="tempTeacher.address" :readonly="readonly" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deleteTeacher, getAllTeacher } from '../../api/teacher'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'SearchTeacher',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        studentName: '',
        teacher: {
          teacherId: '',
          actualName: '',
          valided: 1 // 只显示已经审核成功的教师
        }
      },
      tempTeacher: {},
      readonly: true
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
            message: '无记录',
            type: 'warning'
          })
          this.list = null
          this.total = 0
        }
      })
      setTimeout(() => {
        this.refreshQuery()
        this.listLoading = false
      }, 500)
    },
    refreshQuery() {
      this.listQuery.studentName = undefined
      this.listQuery.teacher.teacherId = undefined
      this.listQuery.teacher.actualName = undefined
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.tempTeacher = Object.assign({}, row)
      this.readonly = true
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      this.listLoading = true
      deleteTeacher(row.teacherId).then((res) => {
        if (res.code === 20000) {
          this.$notify({
            message: '删除成功！',
            type: 'success',
            duration: 1500
          })
          this.list.splice(index, 1)
        } else {
          this.$message('删除失败！')
        }
      })
      setTimeout(() => {
        this.listLoading = false
      }, 1500)
    }

  }
}
</script>

<style scoped>

</style>
