<template>
  <div class="app-container">
    <h>查看所有毕业的学生----此处不区分是哪个老师带的，管理员和教师可以看到的是一样的，仅作展示</h>
    <div class="filter-container">
      <el-input v-model="listQuery.oldStudent.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="状态" prop="finished" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.finished | statusFilter">
            {{ row.finished | confirmFilter }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOldStudentList } from '../../api/student'
import Pagination from '@/components/Pagination'
export default {
  name: 'OldStudent',
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
        1: '毕业',
        0: '结业'
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
        oldStudent: {
          studentId: undefined
        }
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
      getOldStudentList(this.listQuery).then((res) => {
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
      this.listQuery.oldStudent.studentId = undefined
    }
  }

}
</script>

<style scoped>

</style>
