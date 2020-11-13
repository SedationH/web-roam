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

    // vm[key] 访问了get 方法 这个时候就添加了watcher
    // get() {
    //   // 收集依赖 只有
    //   Dep.target && dep.addSub(Dep.target)

    //   // 这里如果通过obj[key] 来调用 会发生没有出口的递归
    //   return val
    // },
    this.oldValue = vm[key]
    // 防止重复添加 已经在对象上的这个属性上添加了监听dep的watcher
    // 就不需要再添加了
    Dep.target = null
  }

  update() {
    const newvalue = this.vm[this.key]
    if (this.oldValue === newvalue) return
    this.cb(newvalue)
  }
}
