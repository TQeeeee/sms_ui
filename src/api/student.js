import request from '@/utils/request'

export function createStudent(data) {
  return request({
    url: '/student/create',
    method: 'post',
    data: data
  })
}
export function getStudentInfo(id) {
  return request({
    url: `/student/get/${id}`,
    method: 'get'
  })
}
export function getStudentList(query) {
  return request({
    url: `/student/findAll`,
    method: 'post',
    data: query
  })
}
export function getOldStudentList(query) {
  return request({
    url: `/oldStudent/findAll`,
    method: 'post',
    data: query
  })
}


export function updateStudent(data) {
  return request({
    url: '/student/update', // '/vue-element-admin/user/info',
    method: 'put',
    data: data
  })
}
export function deleteStudent(id) {
  return request({
    url: `/student/delete/${id}`, // '/vue-element-admin/user/info',
    method: 'delete'
  })
}
