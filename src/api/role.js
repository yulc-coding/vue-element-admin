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
 * 获取角色的菜单列表
 * @param roleId
 */
export function roleMenus(roleId) {
  return request({
    url: "/sys/role/roleMenus/" + roleId,
    method: "get"
  });
}

/**
 * 角色绑定菜单
 * @param data
 */
export function bindMenus(data) {
  return request({
    url: "/sys/role/bindMenus",
    method: "post",
    data
  });
}
