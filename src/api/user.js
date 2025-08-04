import request from "@/utils/request";
import { UserAuth, BanTime } from "@/entity/enums";
import Page from "@/entity/Page";

export function logout() {
  return request({
    url: "/user/logout",
    method: "GET",
  });
}

export function getInfo(id) {
  return request({
    url: id == null ? "/user/getInfo" : `/user/getInfo?id=${id}`,
    method: "GET",
  });
}

export function changeInfo(user) {
  return request({
    url: "/user/changeInfo",
    method: "POST",
    data: user,
  });
}

export function unregister(email, code) {
  return request({
    url: "/user/unregister",
    method: "POST",
    data: {
      email,
      code,
    },
  });
}

/**
 * admin method
 * @param {string} targetID
 * @param {UserAuth} authority
 * @returns
 */
export function changeUserAuth(targetID, authority) {
  return request({
    url: "/user/auth",
    method: "POST",
    data: {
      id: targetID,
      authority,
    },
  });
}

/**
 * admin method
 * @param {string} targetID
 * @param {BanTime} banTime
 */
export function banUser(targetID, banTime) {
  return request({
    url: "/user/ban",
    method: "POST",
    data: {
      targetID,
      banTime,
    },
  });
}

export function getBanTime(targetID) {
  return request({
    url: `/user/ban?id=${targetID}`,
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 * @returns
 */
export function loadUser(page) {
  return request({
    url: `/user/load?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 * @param {string} keyword
 * @returns
 */
export function searchUser(page, keyword) {
  return request({
    url: `/user/search?keyword=${keyword}&pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}
