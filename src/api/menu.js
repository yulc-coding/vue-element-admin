import request from "@/utils/request";

/**
 * 新增
 * @param data
 */
export function add(data) {
  return request({
    url: "/sys/menu/add",
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
    url: "/sys/menu/delete/" + id,
    method: "get"
  });
}

/**
 * 更新
 * @param data
 */
export function update(data) {
  return request({
    url: "/sys/menu/update",
    method: "post",
    data
  });
}

/**
 * 获取部门树
 */
export function tree() {
  return request({
    url: "/sys/menu/tree",
    method: "post"
  });
}

/**
 * 获取信息
 * @param id
 */
export function getInfo(id) {
  return request({
    url: "/sys/menu/get/" + id,
    method: "get"
  });
}
