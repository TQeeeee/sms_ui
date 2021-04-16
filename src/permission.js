import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// 路由拦截器
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  console.log('我是TO:', to)
  console.log('我是FROM:', from)

  // set page title
  // 设置目标页面的title（从目标路由的meta中获取title）
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // 获取store里面的登录令牌，有令牌，表示有登录
  const hasToken = getToken()

  if (hasToken) {
    debugger
    if (to.path === '/login') {
      debugger
      // if is logged in, redirect to the home page
      // 如果有登录，并且目标路径是/login，路由到首页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      debugger
      // determine whether the user has obtained his permission roles through getInfo
      // 获取登录用户的角色，能获取到，表示有角色信息，否则就调用getInfo，获取当前登录用户的角色信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        debugger
        next()
      } else {
        debugger
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // 派发user/getInfo action，获取当前用户的角色信息
          const { roleId } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          // 根据用户的角色信息，派发到permission/generateRoutes action，生成动态路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', [roleId])

          // dynamically add accessible routes
          // 挂载动态路由
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          debugger
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    debugger
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      debugger
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
