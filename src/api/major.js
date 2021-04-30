import request from '@/utils/request'

export function getMajorList() {
  return request({
    url: '/major/findAll',
    method: 'get'
  })
}
export function getDisplayMajorList() {
  return request({
    url: '/major/findAllDisplay',
    method: 'get'
  })
}
export function createMajor(data) {
  return request({
    url: '/major/create', // '/vue-element-admin/user/info',
    method: 'post',
    data: data
  })
}
export function updateMajor(data) {
  return request({
    url: '/major/update', // '/vue-element-admin/user/info',
    method: 'put',
    data: data
  })
}
export function deleteMajor(id) {
  return request({
    url: `/major/delete/${id}`, // '/vue-element-admin/user/info',
    method: 'delete'
  })
}
export function getDisplayClassList(query) {
  return request({
    url: `/class/findAllDisplay`,
    method: 'post',
    data: query
  })
}

export function createClass(data) {
  return request({
    url: `/class/create`,
    method: 'post',
    data: data
  })
}
export function updateClass(data) {
  return request({
    url: '/class/update', // '/vue-element-admin/user/info',
    method: 'put',
    data: data
  })
}
export function deleteClass(id) {
  return request({
    url: `/class/delete/${id}`, // '/vue-element-admin/user/info',
    method: 'delete'
  })
}
export function getClassListByTeacher(id) {
  return request({
    url: `/class/get/${id}`, // '/vue-element-admin/user/info',
    method: 'get'
  })
}
