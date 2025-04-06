/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isValidEmail(str) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return regex.test(str)
}

export function isValidPassword(str) {
  // 8-20个字符，包含至少一个数字，至少一个小写字母，至少一个大写字母
  //   const regex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$.!%*?&]{8,20}$/
  //   return regex.test(str)
  // 包含字母、数字和特殊字符
  const regex = /^[A-Za-z0-9_.*@#$%^&]{5,20}$/
  return regex.test(str)
}

export function isValidUsername(str) {
  // 只包含字母、数字和下划线
  const regex = /^[A-Za-z0-9_]{3,20}$/
  return regex.test(str)
}
