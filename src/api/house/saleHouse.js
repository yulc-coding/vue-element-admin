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
