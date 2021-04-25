import { asyncRoutes, constantRoutes } from '@/router'
// import studentRouter from '@/router/modules/student'
// import tempRouter from '@/router/modules/temp'
// import errorRouter from '@/router/modules/error'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

// 替换route对象中的component
// 前端根据用户角色过滤可以访问的路由
const actions = {
  // 当前的"roles": [
  //             1
  //         ]
// 这里我更改了
  generateRoutes: function({ commit }, roles) {
    const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    // ----------------------------------该代码段不会执行----------------------

    // commit
    commit('SET_ROUTES', accessedRoutes)
    // 成功返回
    // resolve(accessedRoutes)
    return accessedRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
