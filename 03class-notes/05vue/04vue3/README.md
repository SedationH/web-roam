## 使用Vue3完成todomvc

https://github.com/SedationH/my-todomvc

![image-20210117121550858](http://picbed.sedationh.cn/image-20210117121550858.png)

![image-20210117121544331](http://picbed.sedationh.cn/image-20210117121544331.png)



## 理解Vue3的Reactivity

👀 [这里](00vue3-reactivity-system)



## 模拟vite

see [there](01vite-simulation)



## homework

### 1、Vue 3.0 性能提升主要是通过哪几方面体现的？

1. 响应式系统升级
   1. 利用新增的Proxy代替了definePropert
   2. Proxy相比definePropert 有更好的设计
      1. 非侵入式，创建代理对象进行请求拦截
      2. [支持更多的traps](https://github.com/SedationH/web-roam/blob/master/03class-notes/05vue/04vue3/00vue3-reactivity-system/README.md#%E7%AE%80%E5%8D%95%E8%AF%B4%E4%B8%8Bproxy--reflect)
2. 编译优化

[Try](https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%5Cr%5Cn%20%20%3Cdiv%3EI%20am%20Static%3Cspan%3Estatic%3C%2Fspan%3E%3C%2Fdiv%3E%5Cr%5Cn%20%20%3Cdiv%3E%7B%7B%20msg%20%7D%7D%20%3C%2Fdiv%3E%5Cr%5Cn%20%20%3Cbutton%20%40click%3D%5C%22handleClick%5C%22%3Eclick%3C%2Fbutton%3E%5Cr%5Cn%22%2C%22ssr%22%3Afalse%2C%22options%22%3A%7B%22mode%22%3A%22module%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Atrue%2C%22cacheHandlers%22%3Atrue%2C%22scopeId%22%3Anull%2C%22inline%22%3Afalse%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup%22%2C%22foo%22%3A%22setup%22%2C%22bar%22%3A%22props%22%7D%7D%7D)

```html

  <div>I am Static<span>static</span></div>
  <div>{{ msg }} </div>
  <button @click="handleClick">click</button>

```

```js
import { createVNode as _createVNode, createTextVNode as _createTextVNode, toDisplayString as _toDisplayString, Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createVNode("div", null, [
  /*#__PURE__*/_createTextVNode("I am Static"),
  /*#__PURE__*/_createVNode("span", null, "static")
], -1 /* HOISTED */)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createBlock(_Fragment, null, [
    _hoisted_1,
    _createVNode("div", null, _toDisplayString(_ctx.msg), 1 /* TEXT */),
    _createVNode("button", {
      onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.handleClick && _ctx.handleClick(...args)))
    }, "click")
  ], 64 /* STABLE_FRAGMENT */))
}
```

![image-20210118202243970](http://picbed.sedationh.cn/image-20210118202243970.png)

主要是用来优化diff流程的

1. hoistStatic
2. Patch flag，标记动态节点，diff 时跳过静态根节点 只需关心动态节点的**指定内容** ,这个标记的方式很有趣，想起linux的权限控制
3. 缓存事件处理函数



3. 源码体积优化
   1. 移除不常用api
   2. 按需导入 ESModule Tree Shaking 这个不大熟悉

2、Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

from https://www.vuemastery.com/courses/vue-3-essentials/why-the-composition-api/

- As your components get larger readability gets difficult.
  - options API  || Composition API
  - ![](https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png)

- The current code reuse patterns all come with drawbacks.

原先的方法

- mixin
- mixin factory
- slot

now in vue3 `function  useXX`

来实现逻辑复用  (这里体会不是很深)

## 3、Proxy 相对于 Object.defineProperty 有哪些优点？

Proxy相比definePropert 有更好的设计

1. 非侵入式，创建代理对象进行请求拦截
2. [支持更多的traps](https://github.com/SedationH/web-roam/blob/master/03class-notes/05vue/04vue3/00vue3-reactivity-system/README.md#%E7%AE%80%E5%8D%95%E8%AF%B4%E4%B8%8Bproxy--reflect)

4、Vue 3.0 在编译方面有哪些优化？

见问题2

5、Vue.js 3.0 响应式系统的实现原理？

在于要实现响应式的对象的交互中，通过Proxy进行访问

响应式还是那一套

getter 收集依赖 (更新函数)

setter 触发更新

更深入参考

👀 [这里](00vue3-reactivity-system)



感觉这里比vue2的处理让人看着舒服很多。还记得vue2派发更新和dep收集那里让我看得头大