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

