import request from "@/utils/request";

/**
 * 新增
 * @param data
 */
export function add(data) {
  return request({
    url: "/sys/user/add",
    method: "post",
    data
  });
}

/**
 * 删除
 * @param id
 */
export function del(id) {
  return request({
    url: "/sys/user/delete/" + id,
    method: "get"
  });
}

/**
 * 批量删除
 * @param ids 主键ID列表
 */
export function delMulti(ids) {
  return request({
    url: "/sys/user/delMulti",
    method: "post",
    data: {
      idList: ids
    }
  });
}

/**
 * 更新
 * @param data
 */
export function update(data) {
  return request({
    url: "/sys/user/update",
    method: "post",
    data
  });
}

/**
 * 分页查询
 * @param data
 */
export function page(data) {
  return request({
    url: "/sys/user/page",
    method: "post",
    data
  });
}

/**
 * 获取信息
 * @param id
 */
export function getInfo(id) {
  return request({
    url: "/sys/user/get/" + id,
    method: "get"
  });
}

/**
 * 获取用户角色列表
 * @param userId
 */
export function getUserRoles(userId) {
  return request({
    url: "/sys/user/userRoles/" + userId,
    method: "get"
  });
}

/**
 * 绑定角色（批量）
 * @param data
 */
export function bindRole(data) {
  return request({
    url: "/sys/user/bindRole",
    method: "post",
    data
  });
}

/**
 * 重置密码
 * @param id
 */
export function resetPwd(id) {
  return request({
    url: "/sys/user/resetPwd/" + id,
    method: "get"
  });
}
