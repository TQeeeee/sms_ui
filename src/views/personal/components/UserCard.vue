<template>
  <el-card style="margin-bottom:20px;">
    <div class="user-profile">
      <div class="box-center">
        <div class="user-name text-center">{{ user.actualName }}</div>
        <!--        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>-->
      </div>
    </div>

    <div class="user-bio">
      <div v-for="(value,key,index) in user" :key="key" class="user-bio-section">
        <div class="user-bio-section-header"><span>{{ key | keyNameFilter }}</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ value }}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>

export default {
  filters: {
    keyNameFilter(key) {
      const keyNameMap = {
        'actualName': '真实姓名',
        'address': '家庭住址',
        'telephone': '电话号码',
        'gender': '性别',
        'age': '年龄',
        'emailAddress': '邮箱地址',
        'prizeRecord': '奖惩记录',
        'start': '入学时间',
        'classId': '班级ID',
        'gradeId': '年级',
        'majorId': '专业ID',
      }
      return keyNameMap[key]
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '啊啊啊'
        }
      }
    }
  },
  computed: {
    userInfos() {
      return this.user.filter()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
  .text-muted{
    padding-left: 8px;
  }
}
</style>
