import request from '@/utils/request'

// 查询apk管理列表
export function listApk(query) {
  return request({
    url: '/update/apk/list',
    method: 'get',
    params: query
  })
}

// 查询apk管理详细
export function getApk(id) {
  return request({
    url: '/update/apk/' + id,
    method: 'get'
  })
}

const checkUpdate = '/app/checkUpdate/' ;
export function genUpdateApkPath(appKey) {
  return process.env.VUE_APP_BASE_API + checkUpdate + appKey ;
}
export function checkUpdateApk(appKey) {
  return request({
    url:  checkUpdate + appKey,
    method: 'get'
  })
}

// 新增apk管理
export function addApk(data) {
  return request({
    url: '/update/apk',
    method: 'post',

    data: data
  })
}

// 修改apk管理
export function updateApk(data) {
  return request({
    url: '/update/apk',

    method: 'post',
    data: data
  })
}

// 删除apk管理
export function delApk(id) {
  return request({
    url: '/update/apk/' + id,
    method: 'delete'
  })
}

// 导出apk管理
export function exportApk(query) {
  return request({
    url: '/update/apk/export',
    method: 'get',
    params: query
  })
}
