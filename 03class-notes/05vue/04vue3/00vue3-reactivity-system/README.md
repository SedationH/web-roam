browser-sync start -s --index 00proxy.html -f 00proxy.html



## 简单说下Proxy & Reflect

### Proxy

Proxy 对象用于修改某些操作的默认行为（如属性查找、赋值、枚举、函数调用等），等同于在语言层面做出修改，所以属于一种 **元编程**（meta programming），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层 **拦截**，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来 **代理** 某些操作，可以译为 **代理器**。

- `handler`：包含捕捉器（Trap）的占位符对象，可译为处理器对象
- `traps`：提供属性访问的方法，这类似于操作系统中捕获器的概念
- `target`：被 Proxy 处理虚拟化的对象，它常被作为代理的存储后端，根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义）

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```js
const proxy = new Proxy(target, handler);
```

 All traps,  Here is a little cheat sheet [from ecma262](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)

|    Internal Method    |      Handler Method      |
| :-------------------: | :----------------------: |
|        [[Get]]        |           get            |
|      [[Delete]]       |      deleteProperty      |
|  [[OwnPropertyKeys]]  |         ownKeys          |
|    [[HasProperty]]    |           has            |
|       [[Call]]        |          apply           |
| [[DefineOwnProperty]] |      defineProperty      |
|  [[GetPrototypeOf]]   |      getPrototypeOf      |
|  [[SetPrototypeOf]]   |      setPrototypeOf      |
|   [[IsExtensible]]    |       isExtensible       |
| [[PreventExtensions]] |    preventExtensions     |
|  [[GetOwnProperty]]   | getOwnPropertyDescriptor |
|     [[Enumerate]]     |        enumerate         |
|     [[Construct]]     |        construct         |



traps 的处理细节、以set为例子

If the following invariants are violated, the proxy will throw a [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError):

- Cannot change the value of a property to be different from the value of the corresponding target object property if the corresponding target object property is a non-writable, non-configurable data property.
- Cannot set the value of a property if the corresponding target object property is a non-configurable accessor property that has `undefined` as its `[[Set]]` attribute.
- **In strict mode, a `false` return value from the `set()` handler will throw a [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) exception.**



### Reflect

Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与处理器对象的方法相同。Reflect 不是一个函数对象，因此它不是不可构造的。

设计目的：

1. 将 Object 对象的一些明显属于语言内部的方法（比如 `Object.defineProperty`），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。
2. 修改某些 Object 方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)` 在无法定义属性时，会抛出一个错误，而 `Reflect.defineProperty(obj, name, desc)` 则会返回 `false`。
3. 让 Object 的 **命令式操作** 都变成 **函数行为**。比如 `name in obj` 和 `delete obj[name]`，而 `Relfect.has(obj, name)` 和 `Reflect.deleteProperty(obj, name)` 让它们变成了函数行为
4. Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为。

```js
Proxy(target, {
  set: function(target, name, value, receiver) {
    const success = Reflect.set(target, name, value, receiver);

    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }

    return successs;
  },
});
```

上面代码中，Proxy 方法拦截 `target` 对象的属性赋值行为。它采用 `Reflect.set` 方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。

## 对于 receiver 的理解

```js
const obj = {
  get foo() {
    console.log(this)
    return this.bar
  },
  bar: 'obj - bar',
}

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    if (key === 'bar') {
      return 'proxy - bar'
    }
    // return Reflect.get(target, key, target)
    return Reflect.get(target, key, receiver)
  },
})
```

从 trap 中 的 receiver 是proxy 

Reflect 可以改变调用的函数指向

| Reflect 操作对象 | 老方法操作对象                                              |                                                       |
| ---------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| 面向对象         | 全部挂在 `Reflect` 对象上，更加符合面向对象                 | 各种指令方法，`=`、`in`、`delete`                     |
| 函数式           | 所有方法都是函数                                            | 命令式、赋值、函数混用                                |
| 规范报错         | `defineProperty` 无效返回 `false`，后面几个方法参数非法报错 | `defineProperty` 无效报错，后面几个方法参数非法不报错 |
| 方法扩展         | 参数 `receiver` 指定 `this` 指向                            | 不能                                                  |



## 实现reactivity

### reactive

![image-20210117091445142](http://picbed.sedationh.cn/image-20210117091445142.png)

```js
const log = str => console.log(`Reactivity: ${str}`)
const isObject = val =>
  val !== null && typeof val === 'object'
const convert = target =>
  isObject(target) ? reactive(target) : target

/**
 * @param {object} target 需要响应化的对象
 */
function reactive(target) {
  if (!isObject(target)) return target

  const handler = {
    get(target, key, receiver) {
      log('收集依赖')
      const result = Reflect.get(target, key, receiver)
      // 如果result是对象 那么还要对result进行响应处理
      return convert(result)
    },
    set(target, key, value, receiver) {
      log('派发更新')
      const oldValue = Reflect.get(target, value, receiver)
      return (
        value === oldValue ||
        Reflect.set(target, key, value, receiver)
      )
    },
  }

  return new Proxy(target, handler)
}
```



为啥不能解构reactivity返回的proxy，使用简单的解构后的值呢？

```js
const {x, y} = Position 

// babel 降级处理
"use strict";

var _Position = Position,
    x = _Position.x,
    y = _Position.y;
```

[验证](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBA3gDwDQwJ4F8YF4YAUQQCWUh4MQA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Ces2015-loose&prettier=false&targets=&version=7.12.12&externalPlugins=)

 可以通过toRefs包装一下

### track

![image-20210117094845967](http://picbed.sedationh.cn/image-20210117094845967.png)

```js
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
```



## 其他看comment

