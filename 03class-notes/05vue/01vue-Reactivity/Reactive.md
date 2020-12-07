### 具体实现

![image-20201204111925124](http://picbed.sedationh.cn/image-20201204111925124.png)

代码很多 很复杂

但是逻辑和思路是清晰的

如何实现响应式？

让数据有dep进行watcher收集via defineReactive 重写属性的get方法

数据变化的时候能够notify via defineReactive 重写属性的set方法

让watcher实现视图更新



比较难的理解在如何实现一一对应向dep中加入watchr

打两个断点看调用栈

![image-20201204110751953](http://picbed.sedationh.cn/image-20201204110751953.png)



下面是一些具体解释，我感觉是能够大体把握才能看得懂在说什么

在initState(vm)的时候 initData(vm)

```js
let data = vm.$options.data

// observe data
observe(data, true /* asRootData */)
```



![image-20201203104512737](http://picbed.sedationh.cn/image-20201203104512737.png)

src/core/instance/lifecycle.js 中的mountComponent 创建了Watcher

```js
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

在Watcher调用get方法 pushTarget(this)  存储了当前Watcher 实例

```js
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
```

```js
value = this.getter.call(vm, vm) // 调用

updateComponent = () => {
  vm._update(vm._render(), hydrating)// 调用 render
}

vnode = render.call(vm._renderProxy, vm.$createElement) // 执行render方法
```

这个是生产的render函数，with(this) 的使用让里面不存在的变量会在this中寻找_c: createElement _stoString 

当访问值的时候，就会收集触发get方法

```js
(function anonymous(
) {
with(this){return _c('div',{attrs:{"id":"app"}},[_c('h1',[_v(_s(msg))]),_v("\n      "+_s(msg)+"\n    ")])}
})
```

![image-20201130222506441](http://picbed.sedationh.cn/image-20201130222506441.png)

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

```js
get: function reactiveGetter () {
  const value = getter ? getter.call(obj) : val
  if (Dep.target) {
    dep.depend() // 依赖处理
    if (childOb) {
      childOb.dep.depend()
      if (Array.isArray(value)) {
        dependArray(value)
      }
    }
  }
  return value
},
  
  
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  addDep (dep: Dep) {
    const id = dep.id
    // 不重复添加
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

```

![image-20201130223850640](http://picbed.sedationh.cn/image-20201130223850640.png)



整体来看，是在render过程中，via get 来添加依赖的

### 如何处理数组？

```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    // 默认 enumerable: false, 即不可枚举到 通过Object.keys()是拿不到的
    def(value, '__ob__', this)
    // 对数组的处理，通过在原来的方法上套上一层，来实现
    // 不改变地址的情况下，对数组中数据的响应式监听
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
```

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    // 调用原来的方法
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

![image-20201201221024731](http://picbed.sedationh.cn/image-20201201221024731.png)



set和delete就不用多说了用的都是上面这一套

```js
defineReactive(ob.value, key, val)
ob.dep.notify()
```



###  Watcher

- 没有静态方法，$watch要用到Vue的实例
- 创建顺序
  - 1 计算属性
  - 2 用户（侦听器
  - 3 渲染

打断点在Watcher的构造函数上

![image-20201205212353062](http://picbed.sedationh.cn/image-20201205212353062.png)

![image-20201205212412771](http://picbed.sedationh.cn/image-20201205212412771.png)

![image-20201205212428937](http://picbed.sedationh.cn/image-20201205212428937.png)



### $nextTick

- Vue更新Dom是异步执行的，批量处理
- 所以我们对数据的修改在函数执行过程中不能立刻反应在视图了，想要在函数中对视图对数据变动产生相应后获取相关信息，就要异步处理，等待视图更新后异步执行



