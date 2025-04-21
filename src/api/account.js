import request from "@/utils/request";

export function login(email, password, remember) {
  return request({
    url: "/account/login",
    method: "POST",
    data: {
      email,
      password,
      remember,
    },
  });
}

/**
 *
 * @param {*} user email, username, password
 * @param {string} code
 * @returns
 */
export function register(user, code) {
  return request({
    url: `/account/register?code=${code}`,
    method: "POST",
    data: user,
  });
}

export function resetPassword(user, code) {
  return request({
    url: `/account/reset?code=${code}`,
    method: "POST",
    data: user,
  });
}

export function getPublicKey() {
  return request({
    url: "/account/key",
    method: "GET",
  });
}

export function sendVerification(email) {
  const encodedEmail = encodeURIComponent(email);
  return request({
    url: `/account/verify?email=${encodedEmail}`,
    method: "GET",
  });
}

export function checkEmail(email) {
  const encodedEmail = encodeURIComponent(email);
  return request({
    url: `/account/check?email=${encodedEmail}`,
    method: "GET",
  });
}

export function checkUsername(username) {
  const encodedUsername = encodeURIComponent(username);
  return request({
    url: `/account/check?username=${encodedUsername}`,
    method: "GET",
  });
}
