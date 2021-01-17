const log = str => console.log(`Reactivity: ${str}`)
const isObject = val =>
  val !== null && typeof val === 'object'
const convert = target =>
  isObject(target) ? reactive(target) : target

/**
 * 响应化对象
 * @param {object} target 需要响应化的对象
 */
function reactive(target) {
  if (!isObject(target)) return target

  const handler = {
    get(target, key, receiver) {
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      // 如果result是对象 那么还要对result进行响应处理
      return convert(result)
    },
    set(target, key, value, receiver) {
      log('派发更新')
      const oldValue = Reflect.get(target, key, receiver)
      let result = true
      if (value !== oldValue) {
        result = Reflect.set(target, key, value, receiver)
        trigger(target, key)
      }
      return result
    },
  }

  return new Proxy(target, handler)
}

let activeEffect = null

/**
 * 第一次执行的时候执行cb进行依赖收集
 * 派发更新的时候还要执行cb进行数据更新
 * @param {function} cb 执行函数
 */
function effect(cb) {
  activeEffect = cb
  cb()
  activeEffect = null
}

const targetMap = new WeakMap()

/**
 * 收集依赖
 * @param {object} target 需要track的对象
 * @param {string} key track对象具体key
 */
function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))

  dep.add(activeEffect)
}

/**
 * 调用回调函数派发更新
 * @param {object} target 触发更新关联的对象
 * @param {string} key 触发更新关联的对象的key
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  dep && dep.forEach(effect => effect())
}

export { reactive, effect }
