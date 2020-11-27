import History from "./base";

export default class HashHistory extends History {
  constructor(router) {
    super(router);
    // 确保首次访问的时候，#/
    ensureSlash();
  }

  // 获取当前的路由地址
  getCurrentLocation() {
    return window.location.hash.substr(1);
  }

  setupListener() {
    window.addEventListener("hashchange", () => {
      this.transitionTo(this.getCurrentLocation());
    });
  }
}

function ensureSlash() {
  // 判断当前路径中是否有 #
  if (!window.location.hash) {
    window.location.hash = "/";
  }
}
