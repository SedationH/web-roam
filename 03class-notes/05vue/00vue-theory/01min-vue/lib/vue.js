import Observer from "./obsever.js"
import Compiler from "./compiler.js"
export default class Vue {
  constructor(options) {
    // 通过属性保存选择的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$method = options.method || {}
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el
    // 把dat中的成员转换为getter和setter,注入vue实例中
    this._proxyData(this.$data)
    // 调用observer对象，监听$data的变化
    new Observer(this.$data)
    // 调用compiler对象，解析指令和mustache语法
    new Compiler(this)
  }

  _proxyData(data) {
    // 遍历data中的所有属性
    Reflect.ownKeys(data).forEach((key) => {
      // 这个this是vue实例 所以_proxyData完成的任务是在vue实例上
      // 注入option.data 中的数据的setter & getter方法
      Reflect.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          newValue !== data[key] && (data[key] = newValue)
        },
      })
    })
  }
}
