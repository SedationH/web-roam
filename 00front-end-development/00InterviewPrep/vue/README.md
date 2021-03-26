https://github.com/SedationH/vue-interview



## v-if && v-for 优先级

文档指出不要把v-if 和 v-for同时用在一个元素上

v-for 更高

```html
<body>
  <div id="app">
    <!-- 过滤列表中的项目 -->
    <div
      v-for="item in items"
      :key="item.id"
      v-if="item.isActive"
    >
      {{item.name}}
    </div>
  </div>
  <script>
    const app = new Vue({
      el: '#app',
      data() {
        return {
          items: [
            { id: 1, name: 'A', isActive: false },
            { id: 2, name: 'B', isActive: true },
          ],
        }
      },
    })
    console.log(app.$options.render)
  </script>
</body>
```



```js
ƒ anonymous(
) {
with(this){return _c('div',{attrs:{"id":"app"}},_l((items),function(item){return (item.isActive)?_c('div',{key:item.id},[_v("\n        "+_s(item.name)+"\n      ")]):_e()}),0)}
}
```



源码

```js

if (el.staticRoot && !el.staticProcessed) {
  return genStatic(el, state)
} else if (el.once && !el.onceProcessed) {
  return genOnce(el, state)
} else if (el.for && !el.forProcessed) {
  // TODO 这里可以看出for 的优先级更大
  return genFor(el, state)
} else if (el.if && !el.ifProcessed) {
  return genIf(el, state)
} else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
  return genChildren(el, state) || 'void 0'
} else if (el.tag === 'slot') {
  return genSlot(el, state)
} else {
```



场景下如何解决？

利用计算属性

外层套



## key的作用

优化 patch性能



类型 + key 才能判定节点的唯一性

渲染列表的时候才能仅仅通过key来判断

尽可能的复用节点

```js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```



diff 逻辑

假设开头与开头

结尾与结尾

`vue/src/core/vdom/patch.js`

d四个指针 

old -> start end

new -> start end



## 双向绑定 v-model

what why how 

视图和数据同时相互同步

value @input

