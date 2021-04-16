import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login', // '/vue-element-admin/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info', // '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout', // '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getUserList(query) {
  return request({
    url: '/user/findPage',
    method: 'get',
    params: query
  })
}

export function importUser(data) {
  return request({
    url: '/user/import', // '/vue-element-admin/user/info',
    method: 'post',
    data: data
  })
}

export function createUser(data) {
  return request({
    url: '/user/create', // '/vue-element-admin/user/info',
    method: 'post',
    data: data
  })
}
export function updateUser(data) {
  return request({
    url: '/user/update', // '/vue-element-admin/user/info',
    method: 'put',
    data: data
  })
}
export function deleteUser(id) {
  return request({
    url: `/user/delete/${id}`, // '/vue-element-admin/user/info',
    method: 'delete'
  })
}

