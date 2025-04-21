import request from "@/utils/request";
import Page from "@/entity/Page";
import { PSetUserAuth } from "@/entity/enums";

export function addPSet(problemSet) {
  return request({
    url: "/pset/add",
    method: "POST",
    data: problemSet,
  });
}

export function modifyPSet(problemSet) {
  return request({
    url: "/pset/modify",
    method: "POST",
    data: problemSet,
  });
}

export function deletePSet(id) {
  return request({
    url: `/pset/delete?id=${id}`,
    method: "GET",
    data: id,
  });
}

export function getInfo(id) {
  return request({
    url: `/pset/get?id=${id}`,
    method: "GET",
  });
}

export function getProblem(page, id) {
  return request({
    url: `/pset/problem/get?id=${id}&pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

export function getAuth(id) {
  return request({
    url: `/pset/auth?id=${id}`,
    method: "GET",
  });
}

export function loadPSet(page) {
  return request({
    url: `/pset/load?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 * @param {PSetUserAuth} authority
 */
export function loadByAuth(page, authority) {
  return request({
    url: `/pset/load/auth?authority=${authority}&pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

export function searchPSet(page, keyword) {
  return request({
    url: `/pset/search?keyword=${keyword}&pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

/**
 *
 * @param {string} psetID
 * @param {PSetUserAuth} authority
 */
export function getUser(psetID, authority) {
  return request({
    url: `/pset/user/get`,
    method: "POST",
    data: {
      psetID,
      authority,
    },
  });
}

/**
 *
 * @param {string} psetID
 * @param {string} targetID
 * @param {PSetUserAuth} authority
 */
export function addUser(psetID, targetID, authority) {
  return request({
    url: `/pset/user/add`,
    method: "POST",
    data: {
      psetID,
      targetID,
      authority,
    },
  });
}

export function deleteUser(psetID, targetID) {
  return request({
    url: `/pset/user/delete`,
    method: "POST",
    data: {
      psetID,
      targetID,
    },
  });
}

/**
 *
 * @param {string} psetID
 * @param {string} targetID
 * @param {PSetUserAuth} authority
 */
export function changeUserAuth(psetID, targetID, authority) {
  return request({
    url: `/pset/user/auth`,
    method: "POST",
    data: {
      psetID,
      targetID,
      authority,
    },
  });
}

export function addProblem(psetID, problemID) {
  return request({
    url: `/pset/problem/add`,
    method: "POST",
    data: {
      psetID,
      problemID,
    },
  });
}

export function deleteProblem(psetID, problemID) {
  return request({
    url: `/pset/problem/delete`,
    method: "POST",
    data: {
      psetID,
      problemID,
    },
  });
}

/**
 *
 * @param {string} psetID
 * @param {boolean} flag
 * @returns
 */
export function favorite(psetID, flag) {
  return request({
    url: `/pset/favorite`,
    method: "POST",
    data: {
      psetID,
      flag,
    },
  });
}
