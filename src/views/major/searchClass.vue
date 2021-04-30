<template>
  <div class="app-container">
    <h>教师查询自己带的所有班级</h>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="index" type="index" align="center" width="80" :index="makeIndex" />
      <el-table-column label="班级ID" prop="classId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.classId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级名称" prop="className" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年级" prop="gradeId" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.gradeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业ID" prop="majorId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.majorId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生数量" prop="studentCount" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.studentCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大容量" prop="maxCount" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.maxCount }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getClassListByTeacher } from '../../api/major'
export default {
  name: 'SearchClass',
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getClassListByTeacher(this.userId).then((res) => {
        if (res.code === 20000) {
          this.list = res.data
        }
      })
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    makeIndex(index) {
      return index + 1
    }
  }
}
</script>

<style scoped>

</style>
