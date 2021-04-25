import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

import adminRouter from './modules/admin'
import studentRouter from './modules/student'

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
    path: '/forgetPassword',
    // 到forgetPassword组件
    component: () => import('@/views/login/forgetPassword'),
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
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 异步路由表
 * 只有拥有权限（对应角色）的用户，才能显示的路由表
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // 三个。。。含义：将adminRouter数组中的内容取出
  ...adminRouter,
  ...studentRouter,
  { path: '*', redirect: '/404', hidden: true }
  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
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
