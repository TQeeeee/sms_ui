import request from '@/utils/request'

export function createTeacher(data) {
  return request({
    url: '/teacher/create',
    method: 'post',
    data: data
  })
}
export function getTeacherInfo(id) {
  return request({
    url: `/teacher/get/${id}`,
    method: 'get'
  })
}
export function updateTeacher(data) {
  return request({
    url: `/teacher/update`,
    method: 'put',
    data: data
  })
}
export function getAllTeacher(data) {
  return request({
    url: `/teacher/findAll`,
    method: 'post',
    data: data
  })
}
export function findAllNoPage() {
  return request({
    url: `/teacher/getAll`,
    method: 'get'
  })
}

export function deleteTeacher(id) {
  return request({
    url: `/teacher/delete/${id}`, // '/vue-element-admin/user/info',
    method: 'delete'
  })
}
