# 说说你对Vue响应式的理解

https://svelte.dev/blog/svelte-3-rethinking-reactivity

https://cn.vuejs.org/v2/guide/reactivity.html



## what

响应是一种依赖关系

A 的 变化可能会影响B、C、D ... ，B C D可以感知到这种变化并作出反应

如同现实世界中，我打你一圈，你会疼，痛感就是你的反应，在我打你这个行为和你的感知上，建立了依赖关系。物理与生物规则帮我们建立起来了这个响应。

在Excel表格中也能建立起数据之间的响应式关系，Sum函数...

Vue建立起数据模型和视图之间的响应，使得在我们修改数据模型后，视图自动进行响应



## why

框架是对底层DOM操作的封装

Web所承载的内容更加复杂，变化也更佳复杂

专注于数据，对数据有依赖的视图自动变化

数据驱动开发



## how

MVVM ->  Model View ViewMoel

![img](http://picbed.sedationh.cn/16948be2831cfa1b.png)

通过Vue拿到数据的的变动，并同步到View，Web语境下就是网页上

https://www.zhihu.com/question/31809713/answer/53544875



### 如何感知变动呢？

#### 观察者模式

定义对象见1 : n的依赖关系，使得某个对象发生变化的时候，其依赖对象能够产型反应。又叫发布订阅模式。

从Web角度来看，网页上的展示数据是由相关DOM进行决定的，即DOM节点是需要进行更新的，应该自己实现update方法，我们想和相关DOM节点进行绑定的数据是要能通知DOM节点进行更新的，要有notify方法，还要有加入所依赖节点的addSub

数据和节点的关系是 1: n 的

```js
class Watcher {
  update() {}
}

class Dep {
  constructor() {
    this.watcherArray = []
  }
  addWacher() {}
  notify() {
    // 使用watcherArray中存储的watcher的update进行更新
  }
}

const DOMNode = new Watcher()
const data = new Dep()

data.addWacher(DOMNode)
data.notify()

```



#### Vue的具体实现

v2

一个普通对象作为data传入Vue

```js
const data = {
  foo: 'foo'
}
const vm = new Vue({
  data
})
```

通过`Object.defineProperty` (递归)来把data的 property全部转为vm实例的getter && setter属性，也对data进行getter && setter的处理

![data](http://picbed.sedationh.cn/data.png)

每个组件实例 (new Vue出来的 or 模版 render出来的)都对应一个watcher

每个组件实例都对应一个 **watcher** 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。



> 这里的理解好像并不符合上面的设计模式，并没有在节点和和数据两者间直接建立关系
>
> 
>
> 在vue 1中是没有patch的，因为界面中每个依赖（DOM节点）都有专门的watcher负责更新，这样项目规模变大就会成为性能瓶颈，vue 2中为了降低watcher粒度，每个组件只有一个watcher，但是当需要更新的时候，怎样才能精确找到发生变化的地方？这就需要引入patch才行。这就涉及虚拟DOM和patch算法了。



这里还存在Object.defineProperty的一些问题

- 初始化时需要遍历对象所有key，如果对象层级较深，性能不好
- 动态新增、删除对象属性无法拦截，只能用特定set/delete api代替
- 数组需要将方法特殊处理，无法使用下标直接赋值



v3通过 Proxy来解决

https://gomakethings.com/how-to-create-a-reactive-state-based-ui-component-with-vanilla-js-proxies/

更好的性能

非侵入的写法（使用代理对象而不是在原有对象上操作）

更多的情况监听、数组原生支持～

