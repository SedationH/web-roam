## 区分

标准函数和箭头函数中的this有不同的行为



标准函数中，this引用的是把函数当成方法调用的上下文对象



箭头函数中，this引用的是定义箭头函数的上下文



```js
const foo = {
  getName: function () {
    return this.name
  },
  getAge: function () {
    return this.age
  },
  getHeight: () => {
    return this.height
  },
  name: 'foo',
  age: 12,
  height: 174,
}

name = 'window'
height = 1
var age = 0

const fooGetName = foo.getName
const fooGetAge = foo.getAge

console.log(
  foo.getName(),
  foo.getAge(),
  foo.getHeight(),
  fooGetName(),
  fooGetAge()
)
// foo 12 1 window 0
```

值得注意的是

使用pacel进行调试的过程中

![image-20210314094518204](http://picbed.sedationh.cn/image-20210314094518204.png)

对我开始的结果实验产生了一些误导



## 具体

![image-20200505175606964](http://picbed.sedationh.cn/image-20200505175606964.png)

> 标准函数中，this引用的是把函数当成方法调用的上下文对象
>
> 箭头函数中，this引用的是定义箭头函数的上下文

这个是正常表现



我们还有一些骚操作可以改变this

bind call apply

new 的语法（从实现来看，也是用上面的方法



看了手写，感觉机制到了下面 都是一套

**标准函数中，this引用的是把函数当成方法调用的上下文对象**