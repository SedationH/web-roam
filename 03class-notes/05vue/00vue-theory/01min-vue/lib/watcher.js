import Dep from "./dep.js"

export default class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    // data中属性的名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb
    this.oldValue = vm[key]

    Dep.target = this
    this.oldValue = vm[key]
    Dep.target = null
  }
}
