import request from "@/utils/request";
import Page from "@/entity/Page";

export function addProblem(problem) {
  return request({
    url: "/problem/add",
    method: "POST",
    data: problem,
  });
}

export function modifyProblem(problem) {
  return request({
    url: "/problem/modify",
    method: "POST",
    data: problem,
  });
}

export function deleteProblem(id) {
  return request({
    url: `/problem/delete?id=${id}`,
    method: "GET",
  });
}

export function getProblem(id) {
  return request({
    url: `/problem/get?id=${id}`,
    method: "GET",
  });
}

export function getProblemDetail(id) {
  return request({
    url: `/problem/detail?id=${id}`,
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 */
export function loadProblem(page) {
  return request({
    url: `/problem/load?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 */
export function loadUploaded(page) {
  return request({
    url: `/problem/uploaded?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 * @param {string} keyword
 * @returns
 */
export function searchProblem(page, keyword) {
  return request({
    url: `/problem/search?keyword=${keyword}&pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}
