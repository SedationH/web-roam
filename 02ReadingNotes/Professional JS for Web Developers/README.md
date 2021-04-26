## 红宝书的一些阅读笔记

📝内容

- 疑惑点
- 难点
- 有趣的地方



## Memo

- toString | valueOf -> 基本值
- 寄生继承 -> 工厂
- 闭包 P181



## 继承

JS有其独特的原型链机制，在此基础上进行继承的构建，理解这一点先要知道new干了什么

- 创建个对象
- 调用constructor为这个对象进行初始化 -> 每个对象有自己的实例属性 | 方法
- 把contructor.prototype绑定到这个对象上 -> 对象能够共享constructor.prototype上的方法 `setPrototypeOf`

instanceof 又在干嘛？

```js
function new_instance_of(leftVaule, rightVaule) { 
    let rightProto = rightVaule.prototype // 取右表达式的 prototype 值
    leftVaule = leftVaule.__proto__ // 取左表达式的__proto__值
    while (true) {
    	if (leftVaule === null) {
            return false
        }
        if (leftVaule === rightProto) {
            return true
        } 
        leftVaule = leftVaule.__proto__ 
    }
}
```



在实例上调用某个方法 ｜ 属性

```js
function useProp(obj,prop) {
  const value = instance[prop]
	return value ? value : useProp(Reflect.getPrototypeOf(obj),prop)
}
```

这样的查询链



两个经典继承方式

**组合继承**

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

// Q
Child.prototype = new Parent();
Child.prototype.constructor = Child 
// 别忘了更改constructor,尽管不改 i instanceof Child 仍然成立，但无法通过实例拿到Child构造函数了

var child1 = new Child('kevin', '18');
```



上面有个问题 Q 这里也在使用Parent的构造函数，导致出现在实例上的继承于Parent的实例属性也出现在了Child的静态属性上，尽管前者会覆盖掉后者，但还是不够优美。

需要把Q这里给优化一下

问题的核心在于new Parent会调用Parent构造函数，我们这里只是为了拿到一个对象obj

Reflect.getPrototypeOf(obj) === Parent，来构建原型链

```js
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

const obj = {}
Reflect.setPrototypeOf(obj, Parent.prototype)
Child.prototype.constructor = obj;
// 为了不占用obj这个命名，最好还是封装一下


var child1 = new Child('kevin', '18');
```

上文就是所谓的 **寄生组合式继承**

这一遍读，寄生这个表达给我的感觉就是和返回所需对象的工厂



## 闭包

这个概念和函数的执行环境密切相关

函数的作用域链在创建函数的时候就已经确定，保存在函数内部的[[Scope]]属性之中，

invoke 函数的时候，只不过是复制函数的[[Scope]]属性到执行上下文中

闭包保存的是整个变量对象，而不是单个值P181

```js
function f() {
  var arr = [],i = 0
  for(;i<10;i++){
    arr[i] = () => i
  }
  return arr
}
f()[0]() === 10
```

