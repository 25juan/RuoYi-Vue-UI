import request from '@/utils/request'

// 查询应用信息列表
export function listApplication(query) {
  return request({
    url: '/update/application/list',
    method: 'get',
    params: query
  })
}

// 查询应用信息详细
export function getApplication(id) {
  return request({
    url: '/update/application/' + id,
    method: 'get'
  })
}

// 新增应用信息
export function addApplication(data) {
  return request({
    url: '/update/application',
    method: 'post',
    data: data
  })
}

// 修改应用信息
export function updateApplication(data) {
  return request({
    url: '/update/application',
    method: 'put',
    data: data
  })
}

// 删除应用信息
export function delApplication(id) {
  return request({
    url: '/update/application/' + id,
    method: 'delete'
  })
}

// 导出应用信息
export function exportApplication(query) {
  return request({
    url: '/update/application/export',
    method: 'get',
    params: query
  })
}