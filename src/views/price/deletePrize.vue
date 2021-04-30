<template>
  <div class="app-container">
    <h3>删除学籍表中的奖惩记录</h3>
    <div class="filter-container">
      <el-input v-model="listQuery.student.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="学号" prop="studentId" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="actualName" align="center" min-width="90">
        <template slot-scope="{row}">
          <span>{{ row.actualName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" prop="classId" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.classId }}</span>
          <!--            这里要对classId进行map  这个是教师也不能更改的-->
        </template>
      </el-table-column>
      <el-table-column label="年级" prop="gradeId" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.gradeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" style="margin-right: 10px" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button type="warning" size="mini" @click="handleDetail(row)">
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="readonly?'Detail':'Edit'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempStudent" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="actualName">
          <el-input v-model="tempStudent.actualName" :readonly="true" />
        </el-form-item>
        <el-form-item label="奖惩记录" prop="prizeRecord" :autosize="{ minRows: 2, maxRows: 4}" type="textarea">
          <el-input v-model="tempStudent.prizeRecord" :readonly="readonly" />
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
import { mapGetters } from 'vuex'
import { getStudentList, updateStudent } from '../../api/student'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'DeletePrize',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        teacherId: undefined,
        student: {
          studentId: undefined,
          confirmed: 1
        }
      },
      // 添加或更改用户所需的数据栏
      tempStudent: { // undefined是真正的啥也没有
        studentId: '',
        actualName: '',
        telephone: undefined,
        address: undefined,
        gender: '',
        age: undefined,
        start: undefined,
        end: undefined,
        classId: '',
        gradeId: undefined,
        majorId: '',
        finished: undefined,
        confirmed: 1,
        prizeRecord: undefined
      },
      dialogFormVisible: false,
      readonly: true,
      rules: {
        actualName: [{ required: true, message: 'actualName is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'roleId'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // 根据用户角色构造查询条件
      getStudentList(this.listQuery).then((res) => {
        if (res.code === 20000) {
          this.list = res.data.items
          this.total = res.data.total
          this.refreshQuery()
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      }).catch(() => {
        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      })
    },
    makeIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    refreshQuery() {
      // 把查询条件置为初始值
      this.listQuery.teacherId = undefined
      this.listQuery.student.studentId = undefined
      this.listQuery.student.confirmed = 1
    },
    handleUpdate(row) {
      this.readonly = false
      this.tempStudent = Object.assign({}, row)
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate() // 清理掉格式校验器
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempStudent)
          // 可以更改某些字段
          updateStudent(tempData).then(() => {
            const index = this.list.findIndex(v => v.studentId === tempData.studentId) // userIndex是永远不会变的X
            this.list.splice(index, 1, tempData)
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
    handleDetail(row) {
      this.readonly = true
      this.tempStudent = Object.assign({}, row)
      this.dialogFormVisible = true
    }

  }
}
</script>

<style scoped>

</style>
