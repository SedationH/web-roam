# this：从JavaScript执行上下文的视角讲清楚this

```js
const obj = {
  name: 'sedationh',
  getName: function(){
    return name
  }
}
let name = 'global'
obj.getName() // global
```

getName函数通过作用域链寻找name，obj并没有创建执行上下文,最终outer -> global context的 name

区分清楚**作用域链**和**this**是两套不同的系统，它们之间基本没太多联系。

**在对象内部的方法中使用对象内部的属性是一个非常普遍的需求**。但是 JavaScript 的作用域机制并不支持这一点，基于这个需求，JavaScript 又搞出来另外一套**this 机制**。

so modify: `getName(){return this.name}`即可



## JS 中的this是什么

![image-20200528115924799](http://picbed.sedationh.cn/image-20200528115924799.png)

this是和execution context绑定的，可执行代码的执行会创建执行上下文

可执行代码：

- global -> this 即window对象
- function
- eval(略)

就function比较特别

## function中的this

![image-20200505175606964](http://picbed.sedationh.cn/image-20200505175606964.png)

关于new的情况 看一下new的原理就知道了



## 一些技巧

```js
var myObj = {
  name : " 极客时间 ", 
  showThis: function(){
    function bar(){console.log(this)}
    bar()
  }
}
myObj.showThis() // window
```

bar执行，this仍为window,this为关键字，没法直接饮用建立闭包

Solution:

```js
var myObj = {
  name : " 极客时间 ", 
  showThis: function(){
    const self = this
    function bar(){console.log(self)}
    bar()
  }
}
myObj.showThis() // {name: " 极客时间 ", showThis: ƒ}
```

这个方法的的本质是**把 this 体系转换为了作用域的体系**。



因为箭头函数**不会创建**执行上下文,this为所属环境中的this

```js
var myObj = {
  name : " 极客时间 ", 
  showThis: function(){
    const bar = ()=> {console.log(this)}
    bar()
  }
}
myObj.showThis() // {name: " 极客时间 ", showThis: ƒ}
```

