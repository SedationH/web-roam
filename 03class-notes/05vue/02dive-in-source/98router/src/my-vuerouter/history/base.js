import createRoute from "../utils/route";

export default class History {
  constructor(router) {
    this.router = router;
    // 根据当前的路由地址，获取到的route对象{ matched: [], path }
    this.current = createRoute(null, "/");

    this.cb = null;
  }

  listen(cb) {
    this.cb = cb;
  }

  transitionTo(path, onComplete) {
    // 当current改变，希望重新渲染视图，，，问题是此时是否会渲染？
    this.current = this.router.matcher.match(path);

    this.cb && this.cb(this.current);

    onComplete && onComplete();
  }
}
