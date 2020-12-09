import install from "./install";
import createMatcher from "./create-matcher";
import HashHistory from "./history/hash";
import HTML5History from "./history/html5";

export default class VueRouter {
  constructor(options) {
    this._routes = options.routes || [];
    // 匹配器对象
    this.matcher = createMatcher(this._routes);

    const mode = options.mode || "hash";
    switch (mode) {
      case "hash":
        this.history = new HashHistory(this);
        break;
      case "history":
        this.history = new HTML5History(this);
        break;
    }
  }

  init(vm) {
    // vm为根实例 经历一次init
    const history = this.history;

    // vm._route =
    history.listen(current => {
      vm._route = current;
      // console.log(vm._route)
    });

    const setupListener = () => {
      history.setupListener();
    };

    history.transitionTo(
      history.getCurrentLocation(),
      setupListener
    );
  }
}

VueRouter.install = install;
