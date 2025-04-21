/**
 * 递归过滤异步路由表
 * @param routes 待过滤路由
 * @param roles 当前用户角色
 */
export function filterAsyncRoutes(routes, roles) {
  return routes.filter((route) => {
    if (hasPermission(roles, route)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, roles);
        // 过滤后可能得到空children数组，需保留父路由显示
        return route.children.length > 0 || route.meta?.alwaysShow;
      }
      return true;
    }
    return false;
  });
}

/**
 * 检查路由权限
 * @param roles 当前用户角色
 * @param route 待检查路由
 */
function hasPermission(roles, route) {
  // 路由未配置权限则默认可见
  if (!route.meta?.roles) return true;

  // 检查角色交集
  return roles.some((role) => route.meta.roles.includes(role));
}
