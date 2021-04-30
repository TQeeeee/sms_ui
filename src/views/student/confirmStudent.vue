<template>
  <div class="app-container">
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
      <el-table-column label="性别" prop="gender" align="center" width="60">
        <template slot-scope="{row}">
          <span>{{ row.gender }}</span>
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
      <el-table-column label="状态" prop="confirmed" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.confirmed | statusFilter">
            {{ row.confirmed | confirmFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" style="margin-right: 10px" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.confirmed === 0" type="success" size="mini" @click="handleConfirm(row)">
            Confirm
          </el-button>
          <el-button v-else type="warning" size="mini" @click="handleDetail(row)">
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="readonly?'Detail':'Edit'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempStudent" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="actualName">
          <el-input v-model="tempStudent.actualName" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="tempStudent.gender" :readonly="readonly" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="address" :autosize="{ minRows: 2, maxRows: 4}" type="textarea">
          <el-input v-model="tempStudent.address" :readonly="readonly" />
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

<!--如果是教师，只可以查看自己所带班级的所有学生信息-->
<script>
import { getStudentList, updateStudent } from '../../api/student'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ConfirmStudent',
  components: { Pagination },
  filters: {
    statusFilter(confirmed) {
      if (confirmed === 1) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    confirmFilter(confirmed) {
      const confirmMap = {
        1: '已审核',
        0: '未审核'
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
        teacherId: undefined,
        student: {
          studentId: undefined
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
        confirmed: undefined,
        prizeRecord: undefined
      },
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      readonly: true,
      dialogStatus: '',
      rules: {
        actualName: [{ required: true, message: 'actualName is required', trigger: 'change' }],
        telephone: [{ required: true, message: 'telephone is required', trigger: 'change' }],
        address: [{ required: true, message: 'address is required', trigger: 'blur' }]
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
      if (this.roleId === 2) {
        this.listQuery.teacherId = this.userId
      }
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
            const index = this.list.findIndex(v => v.studentId === this.tempStudent.studentId) // userIndex是永远不会变的X
            this.list.splice(index, 1, this.tempStudent)
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
    handleConfirm(row) {
      this.tempStudent = Object.assign({}, row)
      this.tempStudent.confirmed = 1
      const tempData = Object.assign({}, row)
      updateStudent(tempData).then(() => {
        // 当前数组里面的这个元素的值也要变为1
        // 主要就是把数组里面元素值变为1，别的是不重要的
        const index = this.list.findIndex(v => v.studentId === tempData.studentId) // userIndex是永远不会变的X
        this.list.splice(index, 1, tempData)
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
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
