import request from "@/utils/request";
import Page from "@/entity/Page";

export function addMessage(message) {
  return request({
    url: "/message/add",
    method: "POST",
    data: message,
  });
}

export function deleteMessage(id) {
  return request({
    url: `/message/delete?id=${id}`,
    method: "GET",
  });
}

export function getMessage(id) {
  return request({
    url: `/message/get?id=${id}`,
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 */
export function loadPublic(page) {
  return request({
    url: `/message/public?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

/**
 * 接收的个人消息
 * @param {Page} page
 */
export function loadPersonal(page) {
  return request({
    url: `/message/personal?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

/**
 * 发送的消息
 * @param {Page} page
 */
export function loadSent(page) {
  return request({
    url: `/message/sent?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}
