## 解答题

一、请说出下列最终的执行结果,并解释为什么。

```js
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}

a[6]() //10
```

why?: a数组中所有的funcion共享一个作用域，打印出的是全局的i

```js
var a = []
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}

a[6]() //10

// ES6 
var b = []
for (let i = 0; i < 10; i++) {
  b[i] = function () {
    console.log(i)
  }
}
b[6]() // 6
// Q 如何从匿名函数的作用域链角度思考block作用域？

var b = []
let j = 0
for (; j < 10; j++) {
  b[j] = function () {
    console.log(j)
  }
}
b[6]() //10


// closure
var c = []
for (var i = 0; i < 10; i++) {
  // 通过function的作用域链机制为每个函数维护自己的i
  c[i] = (function (i) {
    return function () {
      console.log(i)
    }
  })(i)
}
c[6]() //6
```

二、请说出下列最终的执行结果,并解释为什么。

```js
var tep = 123

if (true) {
  console.log(tep)
  let tep
}

// Cannot access 'tep' before initialization
```

**The temporal dead zone and `typeof`**



Unlike with simply undeclared variables and variables that hold a value of `undefined`, using the `typeof` operator to check for the type of a variable in that variable's temporal dead zone will throw a [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError):



三、结合ES6新语法,用最简单的方式找出数组中的最小值。

```js
var arr = [12, 34, 32, 89, 4]

console.log(
  Math.min(...arr),
  arr.reduce((prev, curr) => prev < curr ? prev : curr)
)
```



四、请详细说明var, let, const三种声明变量的方式之间的具体差别。

var 变量提升 可重复声明 值可变 无块作用域

let const 块 不提升 后者锁的是地址，并不是真的不可变



五、请说出下列代码最终输出的结果,并解释为什么。

```js
var a = 10

var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a)
    });
  }
}
obj.fn(); // 20
```

通过obj调用fn，fn函数this指向obj,setTimeout中的函数虽是通过全局再调用，可因为箭头函数使用最近能用的this（没有自己的this），从而也指向obj



六、简述symbol类型的用途。

Symbol 有两个主要的使用场景：

1. “隐藏” 对象属性。 如果我们想要向“属于”另一个脚本或者库的对象添加一个属性，我们可以创建一个 Symbol 并使用它作为属性的键。Symbol 属性不会出现在 `for..in` 中，因此它不会意外地被与其他属性一起处理。并且，它不会被直接访问，因为另一个脚本没有我们的 symbol。因此，该属性将受到保护，防止被意外使用或重写。

   因此我们可以使用 Symbol 属性“秘密地”将一些东西隐藏到我们需要的对象中，但其他地方看不到它。

2. JavaScript 使用了许多系统 Symbol，这些 Symbol 可以作为 `Symbol.*` 访问。我们可以使用它们来改变一些内置行为。例如，在本教程的后面部分，我们将使用 `Symbol.iterator` 来进行 [迭代](https://zh.javascript.info/iterable) 操作，使用 `Symbol.toPrimitive` 来设置 [对象原始值的转换](https://zh.javascript.info/object-toprimitive) 等等。

七、说说什么是浅拷贝,什么是深拷贝?

视角在引用类型上，前者是拷贝最外层对象地址，后者是创建新的地址和空间，遍历整个对象树，每个节点都执行新空间的创建和值相等操作

八、请简述TypeScript与JavaScript之间的关系。

前者是后者的超集 TS = types系统 + 低版本ES转换系统

九、请谈谈你所认为的TypeScript优缺点。

其实就在问对类型系统带来的优缺点

intellisense + 错误预处理 + 更好的阅读性

我还是在云，还没真正体会到类型带来的好处

十、描述引用计数的工作原理和优缺点。

**引用计数**

设计逻辑很简单，通过维护对每个创建的对象(使用内存中的堆内存)的引用计数器，来判断该堆内存是否需要进行回收

- 缺点

  - 不能处理循环引用的现象

  - 维护引用计数器的时间开销大

  - ```js
    function f = {
      const u1 = {}, u2 = {}
    	u1.next = u2
    	u2.next = u1
    }
    f()
    
    // 监管f函数调用结束了，在使用引用计数算法处理内存释放的时候，仍然无法释放u1, u2所使用的堆内存
    ```

- 优点

  - 处理及时，计数器为0就进行回收即可

十一、描述标记整理算法的工作流程。

**标记清除算法**

隔一段时间执行标记清除算法，整个过程分为两个阶段

1. 遍历标记所有可达对象
2. 遍历清除非可达对象，回收相应空间

- 缺点
  - 空间碎片化
- 优点
  - 解决对于循环引用对象的释放

**标记整理算法**

较于标记清除算法，在第二阶段回收前，先进行整理（可达对象集中存放），大范围统一释放堆内存，这样的所提供的堆内存空间是连续的

移动相关对象比较消耗时间

十二、描述V8中新生代存储区垃圾回收的流程。

**v8垃圾回收机制**

使用的堆内存的生命周期长 ? 老生代 : 新生代

针对不同堆内存的使用特点，使用不同的算法

很多文章图文并茂，写得很好了，回看不理解可以[参考1](https://cnodejs.org/topic/5d1cb1ee2beced2efd51f3c7) ， [参考2](https://segmentfault.com/a/1190000000440270#articleHeader15) 下

**新生代**

特点：垃圾回收频繁，对处理速度要求高，空间使用不大 32m ｜ 16m

处理方式：空间换时间 -> Scavenge (复制算法 + 标记整理)

算法逻辑如下

1. 新生代堆内存区域分为两个等大空间
   1. From 指当前活动对象直接使用的空间
   2. To 指空闲空间
2. 逻辑上就是把仍然活动的对象复制到To中，释放掉From中不活动的对象
   - 目前还不晓得具体实现，所以对于复制，清除中的实现细节理不清楚，核心在于v8 c++的实现是如何操作复制和清除逻辑的，这里留个坑
     - [深入1](https://segmentfault.com/a/1190000000440270#articleHeader15)
     - [深入2](https://github.com/tsy77/blog/issues/13)
3. 交换From 和 To指向



有些新生代的的变量会晋升到老圣代中，其特点如下

- 已经经历过一次 Scavenge 回收。
- To（闲置）空间的内存占用超过25%。

**老生代**

特点：大内存，变量存活概率大（生命周期普遍偏长）

> 64位环境下的V8引擎的新生代内存大小32MB、老生代内存大小为1400MB，而32位则减半，分别为16MB和700MB。

处理方式：标记清除+标记整理+增量标记

整体采用标记清除进行空间回收，但这个会引起空间碎片化，因此协调效率和使用体验，在达到一定阙值后进行标记整理 -> 紧缩内存使用

对于整个过程的处理使用增量标记

> 由于全停顿会造成了浏览器一段时间无响应，所以V8使用了一种增量标记的方式，将完整的标记拆分成很多部分，每做完一部分就停下来，让JS的应用逻辑执行一会，这样垃圾回收与应用逻辑交替完成。经过增量标记的改进后，垃圾回收的最大停顿时间可以减少到原来的1/6左右

> V8之所以限制了内存的大小，表面上的原因是V8最初是作为浏览器的JavaScript引擎而设计，不太可能遇到大量内存的场景，而深层次的原因则是由于V8的垃圾回收机制的限制。由于V8需要保证JavaScript应用逻辑与垃圾回收器所看到的不一样，V8在执行垃圾回收时会阻塞JavaScript应用逻辑，直到垃圾回收结束再重新执行JavaScript应用逻辑，这种行为被称为“全停顿”（stop-the-world）。若V8的堆内存为1.5GB，V8做一次小的垃圾回收需要50ms以上，做一次非增量式的垃圾回收甚至要1秒以上。这样浏览器将在1s内失去对用户的响应，造成假死现象。如果有动画效果的话，动画的展现也将显著受到影响



实际的场景中，都是在做tradeoff

十三、描述增量标记算法在何时使用及工作原理。

**增量标记算法**

对垃圾回收的执行进行时间分片，不过长阻塞JS代码的执行

