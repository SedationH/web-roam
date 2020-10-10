## [JavaScript 20 年](https://github.com/doodlewind/jshistory-cn)

从语言发展和设计角度看待JS



## 语言诞生

`void` 运算符仅求值其操作数，然后返回 *undefined*。访问 *undefined* 的一种常见手法是 `void 0`。引入 `void` 运算符是为了作为辅助，以便定义那些会在单击时执行 JavaScript 代码的 HTML 超链接。例如：

```html
<a href="javascript:void usefulFunction()">
  Click to do something useful
</a>
```



### [数据类型与表达式](https://cn.history.js.org/part-1.html#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E4%B8%8E%E8%A1%A8%E8%BE%BE%E5%BC%8F)

JavaScript 1.0 有两个特殊值，用于表示「缺少有用的数据值」。未初始化的变量会被设置为特殊值 *undefined*[17](https://cn.history.js.org/notes.html#17)。这也是程序在尝试访问对象中尚不存在的属性时所返回的值。在 JavaScript 1.0 中，可以通过声明和访问未初始化变量的方式，获取到 *undefined* 这个值。而值 `null` 则旨在表示某个预期存在对象值的上下文里「没有对象」。它是根据 Java 的 `null` 值建模的，有助于将 JavaScript 与 Java 实现的对象进行集成。在整个历史上，同时存在这样两个相似但又有显著不同的值导致了 JavaScript 程序员的困惑，很多人不确定应在何时使用哪个。

### [对象](https://cn.history.js.org/part-1.html#%E5%AF%B9%E8%B1%A1)

方法仅在原型对象上挂载了一次，而不是在构造每个实例对象时重复挂载。由原型对象提供给某个对象的属性称为*继承属性*[g](https://cn.history.js.org/appendices.html#inherited-property)，而直接在对象上定义的属性则称为*自有属性*[g](https://cn.history.js.org/appendices.html#own-property)。自有属性会遮盖同名的继承属性。

```js
// 定义出作为方法被使用的函数
    function ptSum(pt2) {
      return new Point(this.x + pt2.x, this.y + pt2.y);
    }
    function ptDistance(pt2) {
      return Math.sqrt(Math.pow(pt2.x - this.x, 2) + Math.pow(pt2.y - this.y, 2));
    }

    // 定义 Point 构造函数
    function Point(x, y) {
      // 创建并初始化新对象的数据属性
      this.x = x;
      this.y = y;

      this.sum = function() {
        console.log('this is inner function sum')
      }
    }

    // 添加方法到共享的原型对象
    Point.prototype.sum = ptSum;
    Point.prototype.distance = ptDistance;

    var origin = new Point(0, 0);

    console.log(origin)

    origin.sum()
    console.log(origin[1]) // undefined
```



![image-20200928092006613](http://picbed.sedationh.cn/image-20200928092006613.png)



### [函数对象](https://cn.history.js.org/part-1.html#%E5%87%BD%E6%95%B0%E5%AF%B9%E8%B1%A1)

函数需要用形式参数列表（formal parameter list）来声明。但参数列表的大小，并不会限制调用函数时可传递的参数数量。如果调用函数时传递的实参（实际参数，argument）数量少于其声明的形参（形式参数，parameter）数量，那么多余的形参将被设置为 *undefined*。而如果传递的实参数量超过形参数量，则会对额外的实参求值，但无法通过形参名称获得这些值。不过在执行函数体期间，还可以使用类似数组的实参对象（arguments object）作为函数对象 `arguments` 属性的值。调用函数时传递的所有实参，都可以用作 `arguments` 对象的整数键（integer-keyed）属性。这样一来，就可以支持可变长度参数列表的函数了。



### [执行模型](https://cn.history.js.org/part-1.html#%E6%89%A7%E8%A1%8C%E6%A8%A1%E5%9E%8B)

在 Netscape 2 中，每个 `<script>` 元素里的 JavaScript 代码都会按照它们在页面 HTML 文件中的出现顺序，逐个解析和求值。在后来的浏览器中，还可以标记 `<script>` 元素以支持延迟求值（deferred evaluation）。这使得浏览器可以在等待从网络上请求 JavaScript 代码的同时，继续处理 HTML。但不论在哪种情况下，浏览器一次都只会求值一个脚本。脚本之间通常共享同一个全局对象。由脚本创建的全局变量和函数，对所有后续脚本均可见。每个脚本都会运行到完成（run to completion），而不会被抢占（preëmption）或中断（interruption）。早期浏览器的这一特性已成为 JavaScript 的一条基本原理。脚本是执行的基本单位。每个脚本的执行一旦开始，就会持续到它完成为止。在脚本内部，不必担心其他脚本的并发执行，因为这种情况不会发生。

网页框架（Web page frame）的概念[20](https://cn.history.js.org/notes.html#20)。页框（frame）是网页的一个区域，可以在其中载入单独的 HTML 文档。

**这里对于frame的执行环境存疑**

### 迷惑行为与 Bug

- == 设计的目的

隐式类型转换旨在降低最初采用 JavaScript 作为简单脚本语言的入门障碍。但随着 JavaScript 逐渐演变为通用语言，事实证明它是导致混淆和编码错误的重要来源，对 `==` 运算符来说尤其如此。在最初的 10 天冲刺之后，添加到 Mocha 中的一些有问题的转换规则，原本是为了响应 alpha 用户的请求，以简化 JavaScript 同 HTTP / HTML 的集成。例如，Netscape 的内部用户要求使用 `==` 来比较包含字符串值 `"404"` 的 HTTP 状态码与数字 404。他们还要求在数字上下文中将空字符串自动转换为 `0`，从而为 HTML 表单的空字段提供默认值。这些类型转换规则带来了一些意外，例如 `1 == '1'` 且 `1 == '1.0'`，但 `'1' != '1.0'`。

- this 关键字

每个函数都有一个隐式的 `this` 形参。将函数作为方法调用时，这个参数会被设置为用于访问该方法的对象。这和大多数面向对象语言中的 `this`（或 `self`）含义相同。但是 JavaScript 在「关联到对象的方法」与「独立函数」这两者之间，使用了单一的定义形式。

由于某些 HTML 会将 JavaScript 代码段隐式转换成作为方法调用的函数，因此 `this` 引起了进一步的混乱。例如：

```html
<button name="B" onclick="alert(this.name + " clicked")>
  Click me
</button> 
```

当执行事件处理器时，它将触发按钮的 `onclick` 方法。这时 `this` 指向按钮对象，然后 `this.name` 会检索其 `name` 属性的值。

- 原始值的属性

对数字、布尔值或字符串值做属性访问或赋值时，会使用内置的 Number / Boolean / String 构造函数隐式创建「包装器对象」（wrapper object）。属性访问是在包装器（wrapper）上执行的，并且通常会从其内置原型来访问继承的属性。通过自动调用 `valueOf` 和 `toString` 方法执行的类型转换，使得在大多数情况下，包装器可以被视为原始值来使用。