<template>
  <div class="app-container">
    <h>这里是添加班级，必须指定辅导员，专业，最大人数</h>
    <h>同时可以显示出当前的所有班级信息,要可以更改班级信息和辅导员</h>
    <div class="filter-container">
      <el-input v-model="listQuery.teacherName" placeholder="辅导员姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="专业名称" prop="majorName" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.majorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="辅导员" prop="teacherName" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.teacherName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前学生数" prop="studentCount" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.studentCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大学生数" prop="maxCount" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.maxCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" style="margin-right: 10px" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认要删除该班级吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">Delete</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="班级ID" prop="classId">
          <el-input v-model="tempClass.classId" :readonly="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
          <el-input v-model="tempClass.gradeId" />
        </el-form-item>
        <!--        数据来自于后台-->
        <el-form-item label="专业" prop="majorId">
          <el-select v-model="tempClass.majorId" class="filter-item" placeholder="select major">
            <el-option v-for="item in majorList" :key="item.majorId" :label="item.majorName" :value="item.majorId" />
          </el-select>
        </el-form-item>
        <el-form-item label="辅导员" prop="teacherId">
          <el-select v-model="tempClass.teacherId" class="filter-item" placeholder="select major">
            <el-option v-for="item in teacherList" :key="item.teacherId" :label="item.actualName" :value="item.teacherId" />
          </el-select>
        </el-form-item>
        <!--        数据来自后台-->
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="tempClass.className" />
        </el-form-item>
        <el-form-item label="最大学生数量" prop="maxCount">
          <el-input v-model="tempClass.maxCount" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { createClass, deleteClass, getDisplayClassList, getMajorList, updateClass } from '../../api/major'
import { findAllNoPage } from '../../api/teacher'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'AddClass',
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        teacherName: undefined
      },
      total: 0,
      tempClass: {
        classId: '',
        className: '',
        gradeId: new Date().getFullYear,
        majorId: '',
        teacherId: '',
        studentCount: 0,
        maxCount: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      majorList: [],
      teacherList: []
    }
  },
  created() {
    // 由于操作之间没有明确的先后顺序，故不需要用then来限制
    this.getList()
    this.getMajor()
    this.getTeacher()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDisplayClassList(this.listQuery).then((res) => {
        if (res.code === 20000) {
          this.total = res.data.total
          this.list = res.data.items
        }
      })
      this.listLoading = false
    },
    getMajor() {
      getMajorList().then((res) => {
        if (res.code === 20000) {
          this.majorList = res.data.items
        }
      })
    },
    getTeacher() {
      findAllNoPage().then((res) => {
        if (res.code === 20000) {
          this.teacherList = res.data
        }
      })
    },
    makeIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.tempClass = {
        classId: '',
        className: '',
        gradeId: new Date().getFullYear,
        majorId: '',
        teacherId: '',
        studentCount: 0,
        maxCount: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.tempClass = Object.assign({}, row)
      delete this.tempClass.majorName
      delete this.tempClass.teacherName
      this.tempClass.majorId = ''
      this.tempClass.teacherId = ''
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      if (row.studentCount > 0) {
        this.$message('当前班级学生不为0，不可删除！')
        return
      } else {
        deleteClass(row.classId).then((res) => {
          if (res.code === 20000) {
            this.$message('删除成功！')
            this.list.splice(index, 1)
          }
        })
      }
    },
    createData() {
      const tempData = Object.assign({}, this.tempClass)
      createClass(tempData).then((res) => {
        if (res.code === 20000) {
          this.$message('创建成功!')
          return this.getList()
        } else {
          this.$message('创建失败！')
        }
        this.dialogFormVisible = false
      })
    },
    updateData() {
      const tempData = Object.assign({}, this.tempClass)
      updateClass(tempData).then((res) => {
        if (res.code === 20000) {
          // 通知
          this.$message('更新成功！')
          // 前端页面更改
          // 更改名称
          const majorindex = this.majorList.findIndex(v => v.majorId === tempData.majorId)
          const teacherindex = this.teacherList.findIndex(v => v.teacherId === tempData.teacherId)
          const index = this.list.findIndex(v => v.classId === tempData.classId)
          delete tempData.majorId
          delete tempData.teacherId
          tempData.majorName = this.majorList[majorindex].majorName
          tempData.teacherName = this.teacherList[teacherindex].actualName
          this.list.splice(index, 1, tempData)
        }
        this.dialogFormVisible = false
      })
    }

  }
}
</script>

<style scoped>

</style>
