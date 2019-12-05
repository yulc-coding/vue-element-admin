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
    ids
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
 * 绑定角色
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
 * 修改密码
 * @param data
 */
export function changePwd(data) {
  return request({
    url: "/sys/user/changePwd",
    method: "post",
    data
  });
}
