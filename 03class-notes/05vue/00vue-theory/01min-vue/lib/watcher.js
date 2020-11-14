import Dep from "./dep.js"

export default class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    // data中属性的名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb

    Dep.target = this

    // vm[key] 访问了get 方法 这个时候就添加了watcher
    // get() {
    //   // 收集依赖 只有
    //   Dep.target && dep.addSub(Dep.target)

    //   // 这里如果通过obj[key] 来调用 会发生没有出口的递归
    //   return val
    // },
    this.oldValue = vm[key]

    // 对于Dep.target的理解
    // 这里注意两个前提条件
    // 创建新的observer对象的时候会在Dep.target上挂上oberser的实例
    // 使用Dep.target的时机是在所有访问vm[key]的时候都要走的判断
    // 但我们只需要添加一个watcher就好了，下面 null 就完成了这个效果
    // 整体来看，我们通过在第一次替换Mastache的时候，进行了Watcher的创建，通过该属性的
    // getter方法来向这个属性的dep实例的subs中添加上面创建的watcher
    Dep.target = null
  }

  update() {
    const newvalue = this.vm[this.key]
    if (this.oldValue === newvalue) return
    this.cb(newvalue)
  }
}
