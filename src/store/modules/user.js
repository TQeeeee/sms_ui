import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  roles: [],
  confirmed: 0,
  roleId: 0,
  userId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CONFIRMED: (state, confirmed) => {
    state.confirmed = confirmed
  },
  SET_ROLEID: (state, roleId) => {
    state.roleId = roleId
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // 将前端提交的this.loginForm解构，传给login(data)
    const { userid, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userid: userid.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { userName, roleId, confirmed, userId } = data
        // roles must be a non-empty array
        if (!roleId || roleId.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', [roleId])
        commit('SET_NAME', userName)
        commit('SET_CONFIRMED', confirmed)
        // roleId 是根据项目实际更改的
        commit('SET_ROLEID', roleId)
        commit('SET_USERID', userId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  userConfirm({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_CONFIRMED', 1)
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      // 把当前的都给清除了
      commit('SET_NAME', '')
      commit('SET_CONFIRMED', undefined)
      // roleId 是根据项目实际更改的
      commit('SET_ROLEID', undefined)
      commit('SET_USERID', '')

      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
