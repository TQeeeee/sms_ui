import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

import adminRouter from './modules/admin'
/**
 * 定义组件名称和组件对象的对应关系
*/
export const componentMap = {
  'layout': require('@/layout').default,
  'redirect_index': () => import('@/views/redirect/index').then(m => m.default),
  'login_index': () => import('@/views/login/index').then(m => m.default),
  'login_auth_redirect': () => import('@/views/login/auth-redirect').then(m => m.default),
  'error_page_404': () => import('@/views/error-page/404').then(m => m.default),
  'error_page_401': () => import('@/views/error-page/401').then(m => m.default),
  'dashboard_index': () => import('@/views/dashboard/index').then(m => m.default),
  'documentation_index': () => import('@/views/documentation/index').then(m => m.default),
  'guide_index': () => import('@/views/guide/index').then(m => m.default),
  'profile_index': () => import('@/views/profile/index').then(m => m.default),
  'permission_menu': () => import('@/views/permission/menu').then(m => m.default),
  'permission_resource': () => import('@/views/permission/permResource').then(m => m.default),
  'permission_role': () => import('@/views/permission/role').then(m => m.default),
  'user_role': () => import('@/views/permission/user').then(m => m.default),
  'icons_index': () => import('@/views/icons/index').then(m => m.default)
}

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   设置菜单是否隐藏（不显示在左边菜单，缺省false）
 * alwaysShow: true               设置在一级菜单上，是否总是显示，true表示总是显示
 *                                如果为false，一级菜单只会在有多个子菜单情况下才显示
 * redirect: noRedirect           如果设置成noRedirect，面包屑不会重定向
 * name:'router-name'             路由名称，必须设置，且唯一
 * meta : {
    roles: ['admin','editor']    允许路由的角色列表
    title: 'title'               显示在左边导航栏和面包屑上的名称
    icon: 'svg-name'/'el-icon-x' 图标名称
    noCache: true                页面是否不要缓存，缺省为false
    affix: true                  标签页面是否总是显示（不能关闭）
    breadcrumb: false            缺省true，是否以面包屑显示页面
    activeMenu: '/example/list'  在左边菜单上高亮显示
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 基本路由表，所有用户都可以访问的路由表
 */
export const constantRoutes = [
  {
    path: '/home',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/guide/index')
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true

  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: import('@/views/Home'),
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: false }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 异步路由表
 * 只有拥有权限（对应角色）的用户，才能显示的路由表
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: [1] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: [1] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: [1]
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // 三个。。。含义：将adminRouter数组中的内容取出
  ...adminRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
