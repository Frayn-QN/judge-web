/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isValidEmail(str) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(str);
}

export function isValidPassword(str) {
  // 8-20个字符，包含字母、数字和特殊字符
  const regex = /^[A-Za-z0-9_.*@#$%^&]{8,20}$/;
  return regex.test(str);
}

export function isValidUsername(str) {
  // 只包含字母、数字和下划线
  const regex = /^[A-Za-z0-9_]{3,20}$/;
  return regex.test(str);
}

export function isValidCode(str) {
  const regex = /^[0-9]{6}$/;
  return regex.test(str);
}
