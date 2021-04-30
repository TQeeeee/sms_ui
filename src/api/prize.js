import request from '@/utils/request'
export function getPrizeList(query) {
  return request({
    url: `/prize/findAll`,
    method: 'post',
    data: query
  })
}
export function updateTempPrize(data) {
  return request({
    url: '/prize/update', // '/vue-element-admin/user/info',
    method: 'put',
    data: data
  })
}
export function confirmTempPrize(id) {
  return request({
    url: `/prize/confirm/${id}`,
    method: 'put'
  })
}
export function createTempPrize(data) {
  return request({
    url: '/prize/create', // '/vue-element-admin/user/info',
    method: 'post',
    data: data
  })
}


export function deletePrize(id) {
  return request({
    url: `/prize/delete/${id}`, // '/vue-element-admin/user/info',
    method: 'delete'
  })
}
