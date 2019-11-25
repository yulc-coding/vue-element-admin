import request from "@/utils/request";

/**
 * 新增
 * @param data
 */
export function add(data) {
  return request({
    url: "/sys/role/add",
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
    url: "/sys/role/delete/" + id,
    method: "get"
  });
}

/**
 * 更新
 * @param data
 */
export function update(data) {
  return request({
    url: "/sys/role/update",
    method: "post",
    data
  });
}

/**
 * 获取角色列表
 */
export function list() {
  return request({
    url: "/sys/role/list",
    method: "get"
  });
}

/**
 * 角色绑定菜单
 * @param data
 */
export function bindMenu(data) {
  return request({
    url: "/sys/role/bindMenu",
    method: "post",
    data
  });
}
