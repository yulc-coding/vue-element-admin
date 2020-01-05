import request from "@/utils/request";

/**
 * 列表
 * @param data
 */
export function page(data) {
  return request({
    url: "/crawler/sale-house/page",
    method: "post",
    data
  });
}

/**
 * 删除
 * @param id
 */
export function findById(id) {
  return request({
    url: "/crawler/sale-house/findById/" + id,
    method: "get"
  });
}

/**
 * 趋势图
 * @param data
 */
export function trend(data) {
  return request({
    url: "/crawler/sale-house/trend",
    method: "post",
    data
  });
}
