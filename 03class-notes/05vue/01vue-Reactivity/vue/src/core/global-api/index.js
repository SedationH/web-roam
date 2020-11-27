/* @flow */

import config from "../config"
import { initUse } from "./use"
import { initMixin } from "./mixin"
import { initExtend } from "./extend"
import { initAssetRegisters } from "./assets"
import { set, del } from "../observer/index"
import { ASSET_TYPES } from "shared/constants"
import builtInComponents from "../components/index"
import { observe } from "core/observer/index"

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from "../util/index"

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      )
    }
  }

  Object.defineProperty(Vue, "config", configDef)
  // 使用场景
  // // install platform specific utils
  // Vue.config.mustUseProp = mustUseProp
  // Vue.config.isReservedTag = isReservedTag
  // Vue.config.isReservedAttr = isReservedAttr
  // Vue.config.getTagNamespace = getTagNamespace
  // Vue.config.isUnknownElement = isUnknownElement

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 初始化Vue.options对象，并拓展
  // components/disrectives/filters属性
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + "s"] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // 浅拷贝 注册全局组建
  // export function extend (to: Object, _from: ?Object): Object {
  //   for (const key in _from) {
  //     to[key] = _from[key]
  //   }
  //   return to
  // }
  // 设置 keep-alive组件
  extend(Vue.options.components, builtInComponents)

  // 注册Vue.use 来注册插件
  initUse(Vue)
  // 注册Vue.mixin来实现对Vue.options的混入
  initMixin(Vue)
  // Vue.extend 通过 传入options返回继承于根Vue的构造函数
  initExtend(Vue)
  // 因为Vue.directive filter component参数的相似 这里统一处理
  initAssetRegisters(Vue)

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
}
