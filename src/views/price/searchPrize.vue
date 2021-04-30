<template>
  <div class="container">
    <h>学生查找自己的奖惩记录</h>
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
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" style="margin-right: 10px" @click="handleDetail(row)">
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--    3种状态：查看detail，编辑update，创建create-->
    <el-dialog :title="查看详情" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempPrize" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学生ID" prop="studentId">
          <el-input v-model="tempPrize.studentId" :readonly="true" />
        </el-form-item>
        <el-form-item label="奖惩记录" prop="prizeRecord">
          <el-input v-model="tempPrize.prizeRecord" :readonly="true" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
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
import Pagination from '@/components/Pagination'
import { getPrizeList } from '../../api/prize'
export default {
  name: 'SearchPrize',
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
        studentId: this.$store.getters.userId,
        teacherName: undefined,
        // 因为只有教师才可以申报学生奖惩信息
        teacherId: undefined
      },
      // 添加或更改用户所需的数据栏
      tempPrize: { // undefined是真正的啥也没有
        studentId: '',
        prizeRecord: ''
      },
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
    handleDetail(row) {
      this.tempPrize = Object.assign({}, row)
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
    }

  }
}
</script>

<style scoped>

</style>
