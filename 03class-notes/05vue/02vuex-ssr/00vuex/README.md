尽管可以父子组件间可以通过props 和 emit的机制来实现联系，但当业务变大，需要交流的组件变多，关系没那么紧密，状态维护起来就比较繁琐

因此把许多要用的数据抽离出去 统一进行管理



简单的实现就是用一个store.js 这样的module对象来统一存储数据

```js
export default {
  state: {
    ...
  },
 	handleToggle(){},
  ....
}
```

大家都对一个对象进行操作，数据不就统一了吗 再用Vue.observe一下响应处理



Vuex就是一个成熟的实现上述需求的🔧

为了简化Vuex在视图中的使用，有提供对应的map方法

```js
...mapMutations([])
...mapState([])
...mapGetter([])
...mapState([])
```



![pic](https://vuex.vuejs.org/vuex.png)

更多mudole啥的 看具体项目中的实践和官方文档吧