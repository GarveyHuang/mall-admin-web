import request from '@/utils/request'
import da from "element-ui/src/locale/lang/da";

export function list(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function getUser(id) {
  return request({
    url: '/admin/' + id,
    method: 'get'
  })
}

export function updateUser(id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteUser(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

export function getRole(adminId) {
  return request({
    url: '/admin/role/' + adminId,
    method: 'get'
  })
}

export function updateAdminRole(adminId, data) {
  return request({
    url: '/admin/role/update/' + adminId,
    method: 'post',
    data: data
  })
}

export function getPermission(adminId) {
  return request({
    url: '/admin/permission/' + adminId,
    method: 'get'
  })
}

export function updateAdminPermission(adminId, data) {
  return request({
    url: '/admin/permission/update/' + adminId,
    method: 'post',
    data: data
  })
}
