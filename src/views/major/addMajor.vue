<template>
  <div class="app-container">
    <h>这里是添加专业</h>
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加专业
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
      <el-table-column label="专业ID" prop="majorId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.majorId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业名称" prop="majorName" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.majorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级数量" prop="classNumber" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.classNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生数量" prop="studentNumber" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.studentNumber }}</span>
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
            title="确认要删除该条记录吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">Delete</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempMajor" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="专业" prop="majorId">
          <el-input v-model="tempMajor.majorId" :readonly="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="专业名称" prop="majorName">
          <el-input v-model="tempMajor.majorName" />
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
import { createMajor, deleteMajor, getDisplayMajorList, updateMajor } from '../../api/major'

export default {
  name: 'AddMajor',
  data() {
    return {
      list: null,
      listLoading: true,
      tempMajor: {
        majorId: '',
        majorName: ''
      },
      tempDisplayMajor: {}, // 就是用来存储更改之后的其余数据的恢复的
      readonly: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getDisplayMajorList().then((res) => {
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
    },
    handleCreate() {
      // 先把要展示的内容清空
      this.resetTemp()
      // 设置状态是create
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.tempDisplayMajor = Object.assign({}, row)
      this.tempMajor = Object.assign({}, row)
      delete this.tempMajor.classNumber
      delete this.tempMajor.studentNumber
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.tempMajor = {
        majorId: '',
        majorName: ''
      }
    },
    createData() {
      const tempData = Object.assign({}, this.tempMajor)
      createMajor(tempData).then((res) => {
        if (res.code === 20000) {
          // 通知
          this.$notify({
            message: '添加成功！',
            type: 'success'
          })
          // 当前页面的数组加载(新增的两个的属性都置为0)，tempMajor不必更改
          tempData.classNumber = 0
          tempData.studentNumber = 0
          this.list.add(tempData)
        } else {
          this.$message('添加失败！')
        }
      })
    },
    updateData() {
      const tempData = Object.assign({}, this.tempMajor)
      updateMajor(tempData).then((res) => {
        if (res.code === 20000) {
          // 通知
          this.$message('更新成功！')
          // 并且将当前页面的数组更新
          tempData.classNumber = this.tempDisplayMajor.classNumber
          tempData.studentNumber = this.tempDisplayMajor.studentNumber
          const index = this.list.findIndex(v => v.majorId === tempData.majorId)
          this.list.splice(index, 1, tempData)
        } else {
          this.$message('更新失败！')
        }
      })
    },
    handleDelete(row, index) {
      // 先判断能否删除
      if (row.classNumber > 0) {
        this.$message('专业仍有班级,不可删除！')
        return
      } else {
        deleteMajor(row.majorId).then((res) => {
          if (res.code === 20000) {
            this.$notify('删除成功！')
            this.list.splice(index, 1)
          }
        })
      }
    }

  }

}
</script>

<style scoped>

</style>
