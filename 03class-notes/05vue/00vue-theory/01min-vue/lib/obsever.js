export default class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    // 判断data是不是对象
    if (!data || typeof data !== "object") return
    Reflect.ownKeys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  //设置数据响应
  defineReactive(obj, key, val) {
    // 如果val是对象，递归让val里面的数据也变为响应式
    this.walk(val)
    const that = this
    Reflect.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 这里如果通过obj[key] 来调用 会发生没有出口的递归
        return val
      },
      set(newValue) {
        if (newValue === val) return
        val = newValue
        // 如果设置的新属性是对象的话，还需要走一遍
        that.walk(newValue)
      },
    })
  }
}
