import request from "@/utils/request";
import Page from "@/entity/Page";

export function addTask(task) {
  return request({
    url: "/task/add",
    method: "POST",
    data: task,
  });
}

export function deleteTask(id) {
  return request({
    url: `/task/delete?id=${id}`,
    method: "GET",
  });
}

export function getTask(id) {
  return request({
    url: `/task/get?id=${id}`,
    method: "GET",
    data: id,
  });
}

export function countByProblem(problemID) {
  return request({
    url: `/task/count/problem?id=${problemID}`,
    method: "GET",
    data: problemID,
  });
}

export function countByUser() {
  return request({
    url: "/task/count/user",
    method: "GET",
  });
}

/**
 *
 * @param {Page} page
 */
export function getHistory(page) {
  return request({
    url: `/task/history?&pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: "GET",
  });
}
