import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/register", "/reset", "/404", "/test"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.username;
      if (!hasGetUserInfo) {
        try {
          // get user info
          await store.dispatch("user/getInfo");
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
      // identify
      if (to.meta.roles && !to.meta.roles.includes(store.getters.roles)) {
        next({ path: "/" });
      }
      next();
    }
  } else {
    /* has no token*/

    if (isPathInWhiteList(to.path)) {
      // in the whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

function isPathInWhiteList(path) {
  return whiteList.some((whitePath) => {
    if (typeof whitePath === "string") {
      return path === whitePath;
    } else if (whitePath instanceof RegExp) {
      return whitePath.test(path);
    }
    return false;
  });
}
