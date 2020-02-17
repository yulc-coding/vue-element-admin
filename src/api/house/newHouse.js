import request from "@/utils/request";

/**
 * 列表
 * @param data
 */
export function page(data) {
  return request({
    url: "/crawler/new-house/page",
    method: "post",
    data
  });
}

/**
 * 根据ID获取详情
 * @param id
 */
export function findById(id) {
  return request({
    url: "/crawler/new-house/findById/" + id,
    method: "get"
  });
}

/**
 * 趋势图
 * @param data
 */
export function trend(data) {
  return request({
    url: "/crawler/new-house/trend",
    method: "post",
    data
  });
}
