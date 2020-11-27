/* @flow */

import { toArray } from "../util/index";

export function initUse(Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 通过Vue.use使用那么this 就是Vue
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    // additional parameters
    // 获得Vue.use(xxx,args) second param
    const args = toArray(arguments, 1);
    // 这里可以看到args的第一参数就是Vue
    args.unshift(this);

    if (typeof plugin.install === "function") {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === "function") {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  };
}
