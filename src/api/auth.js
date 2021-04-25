import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/auth/routes',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

export function sendEmail(data) {
  return request({
    url: '/auth/forgetPassword',
    method: 'post',
    data: data
  })
}

