// 管理员可以访问的路由
// 用户管理
// 角色管理

import Layout from '@/layout'

// 管理员可访问的路由表
const adminRouter =[
  {
    path: '/maintainSysPermission', // 管理系统权限
    component: Layout,
    name: 'MaintainSysPermission',
    meta: {
      icon: 'list',
      title: '管理系统权限',
      roles: [1]
    },
    children: [
      {
        path: 'maintainRole',
        hidden: false,
        component: () => import('@/views/permission/role'),
        name: 'maintainRole',
        meta: {
          title: '管理角色',
          roles: [1]
        }
      },
      {
        // 创建角色的小按钮怎样处理???
        path: 'maintainUserRole',
        hidden: false,
        component: () => import('@/views/permission/user'),
        name: 'maintainUserRole',
        meta: {
          title: '管理用户',
          roles: [1]
        }
      },
      {
        path: 'createRole',
        hidden: true,
        component: Layout,
        name: 'createRole',
        meta: {
          title: '创建角色',
          roles: [1]
        }
      },
      {
        path: 'updateRoleMenu',
        hidden: true,
        component: Layout,
        name: 'updateRoleMenu',
        meta: {
          title: '更改角色菜单',
          roles: [1]
        }
      },
      {
        path: 'updateRolePermission',
        hidden: true,
        component: Layout,
        name: 'updateRolePermission',
        meta: {
          roles: [1]
        }
      },
      {
        path: 'assignUserRole',
        hidden: true,
        component: Layout,
        name: 'assignUserRole',
        meta: {
          roles: [1]
        }
      },
      {
        path: 'deleteRole',
        hidden: true,
        component: Layout,
        name: 'deleteRole',
        meta: {
          roles: [1]
        }
      }
    ]
  },
  {
    path: '/maintainStudentInfo', // 管理学生信息
    component: Layout,
    name: 'MaintainStudentInfo',
    meta: {
      icon: 'list',
      title: '管理学籍信息',
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
        path: 'maintainUserRole',
        hidden: false,
        component: () => import('@/views/permission/user'),
        name: 'maintainUserRole',
        meta: {
          title: '用户管理',
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
      },
      {
        path: 'createRole',
        hidden: true,
        component: Layout,
        name: 'createRole',
        meta: {
          title: '创建角色',
          roles: [1]
        }
      },
      {
        path: 'updateRoleMenu',
        hidden: true,
        component: Layout,
        name: 'updateRoleMenu',
        meta: {
          title: '更改角色菜单',
          roles: [1]
        }
      },
      {
        path: 'updateRolePermission',
        hidden: true,
        component: Layout,
        name: 'updateRolePermission',
        meta: {
          roles: [1]
        }
      },
      {
        path: 'assignUserRole',
        hidden: true,
        component: Layout,
        name: 'assignUserRole',
        meta: {
          roles: [1]
        }
      },
      {
        path: 'deleteRole',
        hidden: true,
        component: Layout,
        name: 'deleteRole',
        meta: {
          roles: [1]
        }
      }
    ]
  }
]
export default adminRouter
