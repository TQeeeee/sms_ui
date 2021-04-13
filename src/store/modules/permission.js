import { asyncRoutes, constantRoutes, componentMap } from '@/router'


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
function replaceComponent(comp){
  if(comp.component && typeof(comp.component)=='string'){
    comp.component = componentMap[comp.component];
  }

  if(comp.children && comp.children.length>0){
    for(let i=0;i<comp.children.length;i++){
      comp.children[i] = replaceComponent(comp.children[i]);
    }
  }
  return comp
}
// 前端根据用户角色过滤可以访问的路由
const actions = {
  // 当前的"roles": [
  //             1
  //         ]

  generateRoutes: function({ commit }, roles) {

    let accessedRoutes
    // 判断当前的角色列表中，是否有包含admin角色
    //其实该方法已经停用---------------------roles里面只是roleId-----为了简化，待改进
    if (roles.includes('admin')) {
      accessedRoutes = asyncRoutes || []
    }
    //----------------------------------该代码段不会执行----------------------
    else {
      // 根据角色，过滤掉不能访问的路由表
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    }

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
