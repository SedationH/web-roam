## 有帮助的资源

[underscore 系列之如何写自己的 underscore](https://github.com/mqyqingfeng/Blog/issues/56#%E5%87%BD%E6%95%B0%E5%AF%B9%E8%B1%A1)

[源码解析](https://yoyoyohamapi.gitbooks.io/undersercore-analysis/content/base/)

需要解释的大部分内容都写在了demo中，这里只是大概提一下



## 关于运算符

```js
// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global ||
  this ||
  {};
```

具体写起来太麻烦了，看mdn吧，说几个要点

1. &&的Operator precedence higher than ||
2. 理解&& 和 || 的执行和返回逻辑



## mixin

mixin用于将原来函数上的静态方法挂载到prototype上，让实例也可以运行，实现的方法非常有意思

注意同一个方法，函数式和OOP的不同



```js
// OOP
_([1,2,3]).each(e => console.log(e))

//函数式
_.each([1,2,3],e => console.log(e)) 
```



如何解决同一种方法参数上的差异？ 在prototype上的所有方法外面都又包裹了一层进行处理



## chain

链式的效果不仅仅是一个chain解决的

而是在构造函数 chain mixin chainResult的共同作用下成功的

debug详细分析看吧