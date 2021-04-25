// 管理员可以访问的路由
// 用户管理
// 角色管理

import Layout from '@/layout'

// 这里roles:[1:管理员，2：教师]
// 管理员可访问的路由表
// 学籍管理，用户管理，班级管理，教师管理，奖惩管理
const tempRouter =
  {
    path: '/maintainPersonal', // 个人中心
    component: Layout,
    name: 'maintainPersonal',
    alwaysShow: true,
    meta: {
      noCache: true,
      icon: 'list',
      title: '个人中心',
      roles: [2, 3]
    },
    children: [
      {
        path: 'personalInfo',
        hidden: false,
        component: () => import('@/views/personal/personalCenter'),
        name: 'personalInfo',
        meta: {
          noCache: true,
          title: '完善个人信息', // 仅能查看的
          roles: [2, 3]
        }
      }
    ]
  }

export default tempRouter
