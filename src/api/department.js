import request from "@/utils/request";

/**
 * 新增
 * @param data
 */
export function add(data) {
  return request({
    url: "/sys/department/add",
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
    url: "/sys/department/del/" + id,
    method: "get"
  });
}

/**
 * 更新
 * @param data
 */
export function update(data) {
  return request({
    url: "/sys/department/update",
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
    url: "/sys/department/get/" + id,
    method: "get"
  });
}

/**
 * 获取部门树
 */
export function tree() {
  return request({
    url: "/sys/department/tree",
    method: "get"
  });
}
