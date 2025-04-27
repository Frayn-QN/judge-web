import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
import { title } from "@/settings";
import { UserAuth } from "@/entity/enums";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    hidden: true,
  },

  {
    path: "/register",
    component: () => import("@/views/login/register.vue"),
    hidden: true,
  },

  {
    path: "/reset",
    component: () => import("@/views/login/reset.vue"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404.vue"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "首页", icon: "dashboard" },
      },
    ],
  },

  {
    path: "/message",
    component: Layout,
    meta: { title: "消息", icon: "message" },
    children: [
      {
        path: "/list",
        component: () => import("@/views/message/list.vue"),
        meta: { title: "消息列表" },
      },
      {
        path: "/send",
        component: () => import("@/views/message/send.vue"),
        meta: { title: "发送消息" },
      },
    ],
  },

  {
    path: "/problem",
    component: Layout,
    meta: { title: "题目", icon: "form" },
    children: [
      {
        path: "",
        name: "Problem",
        component: () => import("@/views/problem/index.vue"),
        hidden: true,
      },
      {
        path: ":id",
        component: () => import("@/views/problem/detail.vue"),
        hidden: true,
        meta: { title: "题目详情" },
      },
    ],
  },

  {
    path: "/pset",
    name: "ProblemSet",
    component: Layout,
    redirect: "/pset/public",
    alwaysShow: true,
    meta: { title: "题集", icon: "folder" },
    children: [
      {
        path: "public",
        component: () => import("@/views/problemset/public.vue"),
        meta: { title: "公开题集" },
      },
      {
        path: "personal",
        component: () => import("@/views/problemset/personal.vue"),
        meta: { title: "我的题集" },
      },
      {
        path: ":id",
        component: () => import("@/views/problemset/detail.vue"),
        hidden: true,
        meta: { title: "题集详情" },
      },
    ],
  },

  {
    path: "/task",
    component: Layout,
    meta: { title: "评测记录", icon: "list" },
    children: [
      {
        path: "",
        name: "Task",
        component: () => import("@/views/task/index.vue"),
        hidden: true,
      },

      {
        path: ":id",
        component: () => import("@/views/task/detail.vue"),
        hidden: true,
        meta: { title: "任务详情" },
      },
    ],
  },

  {
    path: "/coach",
    component: Layout,
    redirect: "/coach/index",
    meta: { title: "题目管理", icon: "education", roles: [UserAuth.Coach] },
    children: [
      {
        path: "index",
        name: "Uploaded",
        component: () => import("@/views/coach/index.vue"),
        meta: { title: "我上传的" },
      },
      {
        path: "add",
        name: "AddProblem",
        component: () => import("@/views/coach/add.vue"),
        meta: { title: "上传题目" },
      },
      {
        path: "edit/:id",
        name: "EditProblem",
        hidden: true,
        component: () => import("@/views/coach/edit.vue"),
        meta: { title: "编辑题目" },
      },
    ],
  },

  {
    path: "/admin",
    component: Layout,
    redirect: "/admin/user",
    meta: { title: "用户管理", icon: "user", roles: [UserAuth.Admin] },
    children: [
      {
        path: "user",
        component: () => import("@/views/admin/user.vue"),
        hidden: true,
      },
    ],
  },

  {
    path: "/user",
    component: Layout,
    redirect: "/user/info",
    children: [
      {
        path: ":id",
        component: () => import("@/views/user/index.vue"),
        hidden: true,
        meta: { title: "用户信息" },
      },
    ],
  },

  {
    path: "/test",
    component: () => import("@/views/testpage/index.vue"),
    hidden: true,
    meta: { role: [UserAuth.Admin] },
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
