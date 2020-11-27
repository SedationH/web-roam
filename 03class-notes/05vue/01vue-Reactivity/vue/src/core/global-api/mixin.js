/* @flow */

import { mergeOptions } from "../util/index"

export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 把mixin中所有的成员放入Vue.options中
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
