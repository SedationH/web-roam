import Vue from "vue";
import Router from "vue-router";
import index from "../components/index.vue";
import list from "../components/tab-list";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: index
    },
    {
      path: "/tab-list",
      name: "tab-list",
      component: list
    }
  ]
});
//  校验登录
router.beforeEach((to, from, next) => {
  if (to.name === "tab-list") {
    if (!sessionStorage.username) {
      window.alert("您的登录信息无效或过期，请重新登录");
      return window.location.replace("/");
    } else {
      next();
    }
  }
  next();
});
export default router;
