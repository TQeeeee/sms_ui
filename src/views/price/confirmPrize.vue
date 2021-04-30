<template>
  <div class="app-container">
    <h>审核奖惩信息</h>
    <div class="filter-container">
      <el-input v-model="listQuery.teacherName" placeholder="辅导员姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="学生id" prop="studentId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" prop="actualName" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.actualName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年级" prop="gradeId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.gradeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" prop="className" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="辅导员姓名" prop="teacherName" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.teacherName }}</span>
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
          <el-button type="success" size="mini" style="margin-right: 10px" @click="handleDetail(row)">
            Detail
          </el-button>
          <el-popconfirm
            v-if="row.confirmed !== 1"
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认审核通过该记录吗？"
            @onConfirm="handleConfirm(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">Delete</el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认删除该记录吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">Delete</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--    3种状态：查看detail-->
    <el-dialog :title="查看详情" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempPrize" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学生ID" prop="studentId">
          <el-input v-model="tempPrize.studentId" :readonly="true" />
        </el-form-item>
        <el-form-item label="奖惩记录" prop="prizeRecord">
          <el-input v-model="tempPrize.prizeRecord" :readonly="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { confirmTempPrize, deletePrize, getPrizeList } from '../../api/prize'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ConfirmPrize',
  components: { Pagination },
  data() {
    return {
      readonly: true,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        studentName: undefined,
        teacherName: undefined,
        studentId: undefined,
        // 因为只有教师才可以申报学生奖惩信息
        teacherId: undefined
      },
      // 添加或更改用户所需的数据栏
      tempPrize: { // undefined是真正的啥也没有
        studentId: '',
        prizeRecord: ''
      },
      displayStudentPrize: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        detail: 'Detail'
      },
      rules: {
        studentId: [{ required: true, message: '学号 is required', trigger: 'change' }],
        prizeRecord: [{ required: true, message: '奖惩记录 is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPrizeList(this.listQuery).then((res) => {
        if (res.code === 20000) {
          this.total = res.data.total
          this.list = res.data.items
        }
      })
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    makeIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.tempPrize = Object.assign({}, row)
      this.readonly = true
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      const recordId = row.recordId
      deletePrize(recordId).then((res) => {
        if (res.code === 20000) {
          this.$notify('该条记录删除成功！')
          this.list.splice(index, 1)
          return
        }
      })
    },
    handleConfirm(row, index) {
      const recordId = row.recordId
      const tempData = Object.assign({}, row)
      tempData.confirmed = 1
      confirmTempPrize(recordId).then((res) => {
        if (res.code === 20000) {
          this.$notify('确认成功!')
          this.list.splice(index, 1, tempData)
        }
      })
    }

  }

}
</script>

<style scoped>

</style>
