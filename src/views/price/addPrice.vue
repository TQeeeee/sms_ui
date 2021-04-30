<template>
  <div class="app-container">
    <h>查看，添加奖惩信息，</h>
    <div class="filter-container">
      <el-input v-model="listQuery.studentName" placeholder="学生姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="状态" prop="confirmed" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.confirmed | statusFilter">
            {{ row.confirmed | confirmFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.confirmed !== 1" type="primary" size="mini" style="margin-right: 10px" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button type="success" size="mini" style="margin-right: 10px" @click="handleDetail(row)">
            Detail
          </el-button>
          <el-popconfirm
            v-if="row.confirmed !== 1"
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

    <!--    3种状态：查看detail，编辑update，创建create-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempPrize" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学生ID" prop="studentId">
          <el-input v-model="tempPrize.studentId" :readonly="dialogStatus !== 'create'" />
        </el-form-item>
        <el-form-item label="奖惩记录" prop="prizeRecord">
          <el-input v-model="tempPrize.prizeRecord" :readonly="dialogStatus === 'detail'" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button v-if="dialogStatus !== 'detail'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { createTempPrize, deletePrize, getPrizeList, updateTempPrize } from '../../api/prize'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AddPrice',
  components: { Pagination },
  filters: {
    statusFilter(confirmed) {
      if (confirmed === 0) {
        return 'primary'
      } else if (confirmed === 1) {
        return 'success'
      } else {
        return 'warning'
      }
    },
    confirmFilter(confirmed) {
      const confirmMap = {
        2: '审核未通过',
        1: '审核通过',
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
        studentName: undefined,
        studentId: undefined,
        teacherName: undefined,
        // 因为只有教师才可以申报学生奖惩信息
        teacherId: this.$store.getters.userId
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
    handleCreate() {
      this.resetTempPrize()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    resetTempPrize() {
      this.tempPrize = {
        studentId: '',
        prizeRecord: ''
      }
    },
    handleUpdate(row) {
      this.tempPrize = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDetail(row) {
      this.tempPrize = Object.assign({}, row)
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      // 肯定是当前未审核或审核失败的
      const recordId = row.recordId
      this.listLoading = true
      deletePrize(recordId).then((res) => {
        if (res.code === 20000) {
          this.$message('删除成功！')
          // 前端页面刷新
          this.list.splice(index, 1)
        }
      })
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    createData() {
      const tempData = Object.assign({}, this.tempPrize)
      createTempPrize(tempData).then((res) => {
        if (res.code === 20000) {
          this.$notify('添加成功！')
          this.dialogFormVisible = false
          return this.getList()
        }
      })
      // 这里创建完成后，进行一次后台交互才能获取新加入后台的数据
    },
    updateData() {
      // 这里更新后只需要在本页面更新
      const tempData = Object.assign({}, this.tempPrize)
      updateTempPrize(tempData).then((res) => {
        if (res.code === 20000) {
          this.$notify('更新成功！')
          // 在页面更新
          const index = this.list.findIndex(v => v.recordId === tempData.recordId)
          this.list.splice(index, 1, tempData)
        } else {
          this.$notify('更新失败！')
        }
        this.dialogFormVisible = false
      })
    }

  }

}
</script>

<style scoped>

</style>
