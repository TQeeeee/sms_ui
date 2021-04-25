// 管理员可以访问的路由
// 用户管理
// 角色管理

import Layout from '@/layout'

// 这里roles:[1:管理员，2：教师]
// 管理员可访问的路由表
// 学籍管理，用户管理，班级管理，教师管理，奖惩管理
const adminRouter = [
  {
    path: '/maintainStudentInfo', // 管理系统权限
    component: Layout,
    name: 'MaintainStudentInfo',
    alwaysShow: true,
    meta: {
      noCache: true,
      icon: 'list',
      title: '学籍管理',
      roles: [1, 2, 3]
    },
    children: [
      {
        path: 'manageStudent',
        hidden: false,
        component: () => import('@/views/student/manageStudent'),
        name: 'manageStudent',
        meta: {
          noCache: true,
          title: '学生管理', // 学生模块
          roles: [1, 2]
        }
      },
      {
        path: 'confirmStudent',
        hidden: false,
        component: () => import('@/views/student/confirmStudent'),
        name: 'confirmStudent',
        meta: {
          noCache: true,
          title: '学籍审核',
          roles: [1, 2]
        }
      },
      {
        path: 'graduateStudent',
        hidden: false,
        component: () => import('@/views/student/graduateStudent'),
        name: 'graduateStudent',
        meta: {
          noCache: true,
          title: '学生毕业',
          roles: [1, 2]
        }
      },
      {
        path: 'oldStudent',
        hidden: false,
        component: () => import('@/views/student/oldStudent'),
        name: 'oldStudent',
        meta: {
          noCache: true,
          title: '查找往届',
          roles: [1]
        }
      }

    ]
  },
  {
    path: '/maintainUserInfo', // 管理用户信息
    component: Layout,
    name: 'MaintainUserInfo',
    alwaysShow: true,
    meta: {
      icon: 'list',
      title: '用户管理',
      roles: [1]
    },
    children: [
      {
        path: 'maintainRole',
        hidden: false,
        component: () => import('@/views/permission/role'),
        name: 'maintainRole',
        meta: {
          title: '角色管理',
          roles: [1]
        }
      },
      {
        // 创建角色的小按钮怎样处理???
        path: 'addUser',
        hidden: false,
        component: () => import('@/views/user/addUser'),
        name: 'addUser',
        meta: {
          title: '系统用户管理',
          roles: [1]
        }
      },
      {
        path: 'importUser',
        hidden: false,
        component: () => import('@/views/user/importUser'),
        name: 'importUser',
        meta: {
          title: '批量导入用户',
          roles: [1]
        }
      }
    ]
  },
  {
    path: '/maintainClassInfo', // 管理班级信息
    component: Layout,
    name: 'MaintainClassInfo',
    alwaysShow: true,
    meta: {
      icon: 'list',
      title: '班级管理',
      roles: [1]
    },
    children: [
      {
        path: 'addMajor',
        hidden: false,
        component: () => import('@/views/major/addMajor'),
        name: 'addMajor',
        meta: {
          title: '增设专业',
          roles: [1]
        }
      },
      {
        path: 'addClass',
        hidden: false,
        component: () => import('@/views/major/addClass'),
        name: 'addClass',
        meta: {
          title: '创建班级',
          roles: [1]
        }
      },
      {
        // 创建角色的小按钮怎样处理???
        path: 'updateInstructor',
        hidden: false,
        component: () => import('@/views/major/updateInstructor'),
        name: 'updateInstructor',
        meta: {
          title: '更改辅导员',
          roles: [1]
        }
      }
    ]
  },
  {
    path: '/maintainTeacherInfo', // 管理用户信息
    component: Layout,
    name: 'MaintainTeacherInfo',
    alwaysShow: true,
    meta: {
      icon: 'list',
      title: '班导管理',
      roles: [1]
    },
    children: [
      {
        path: 'searchTeacher',
        hidden: false,
        component: () => import('@/views/teacher/searchTeacher'),
        name: 'searchTeacher',
        meta: {
          title: '查找辅导员', // 这里要用到多条件组合查询，审核的和未审核的都要显示
          roles: [1]
        }
      },
      {
        path: 'validateTeacher',
        hidden: false,
        component: () => import('@/views/teacher/validateTeacher'),
        name: 'validateTeacher',
        meta: {
          title: '审核辅导员信息',
          roles: [1]
        }
      }
    ]
  },
  {
    path: '/maintainPriceInfo', // 管理用户信息
    hidden: false,
    alwaysShow: true,
    component: Layout,
    name: 'MaintainPriceInfo',
    meta: {
      noCache: true,
      icon: 'list',
      title: '奖惩管理',
      roles: [1, 2, 3]
    },
    children: [
      {
        path: 'addPrize',
        hidden: false,
        component: () => import('@/views/price/addPrice'),
        name: 'addPrize',
        meta: {
          noCache: true,
          title: '填写奖惩信息',
          roles: [1, 2, 3]
        }
      },
      {
        path: 'searchPrize',
        hidden: false,
        component: () => import('@/views/price/searchPrize'),
        name: 'searchPrize',
        meta: {
          noCache: true,
          title: '查找奖惩信息',
          roles: [1, 2, 3]
        }
      },
      {
        path: 'confirmPrize',
        hidden: false,
        component: () => import('@/views/price/confirmPrize'),
        name: 'addPrize',
        meta: {
          noCache: true,
          title: '审核奖惩信息',
          roles: [1]
        }
      },
      {
        path: 'deletePrize',
        hidden: false,
        component: () => import('@/views/price/deletePrize'),
        name: 'deletePrize',
        meta: {
          noCache: true,
          title: '删除奖惩信息',
          roles: [1]
        }
      }
    ]
  }
]
export default adminRouter
