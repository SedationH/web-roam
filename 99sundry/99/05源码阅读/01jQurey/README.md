# jQuery理解与相关基础

有帮助的资源

[从架构入手轻松读懂框架源码：以jQuery，Zepto，Vue和lodash-es为例](https://juejin.im/post/5e549c4d6fb9a07cd614d268#heading-0)

[学习 jQuery 源码整体架构，打造属于自己的 js 类库](https://www.lxchuan12.cn/jQuery/#%E8%87%AA%E6%89%A7%E8%A1%8C%E5%8C%BF%E5%90%8D%E5%87%BD%E6%95%B0)

## Immediately Invoked Function Expression(IIFE)

[简单介绍](https://medium.com/javascript-in-plain-english/https-medium-com-javascript-in-plain-english-stop-feeling-iffy-about-using-an-iife-7b0292aba174)

[MDN](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

[JQ解析1](https://www.cnblogs.com/vajoy/p/3623103.html)

两种写法

```js
// 源码中所用的写法
function(x){
    alert(2* x); 
})(3);
 

(function(x){
    alert(2* x); 
}(3));
```



jQuery就是通过这种方式进入就invoke的，还不污染全局变量，也保证内部代码不被外界随意修改



```js
(function (global, factory) {
  // 兼容nodejs
  ...
  // 为什么要传入window而不让函数自己向上一层找？因为寻找少了一步，会快一点
  factory(global)
})(
	typeof window !== "undefined" ? window : this,
  function(window,noGlobal){
    // 具体实现
  }
);
```





## 无new构造、Prototype相关

[轻松理解JS中的面向对象，顺便搞懂prototype和__proto__](https://juejin.im/post/5e50e5b16fb9a07c9a1959af)

[Function原型相关](https://juejin.im/post/5f13fd5f6fb9a07eb73599c1)

实现无new构造

```js
// 没有new，仅仅是调用jQuery的构造函数，就可以返回一个实例
$('div') !== $('div') // true
```



if

```js
function jQuery() {
  return new jQuery();
}
```

这样就死循环了,所以我们想要实现这个效果，需要new 别的函数 返回产生的实例



源码中的设计

```js
 var
	version = "3.4.1",

	jQuery = function( selector, context ) {
		// 返回new之后的对象
		return new jQuery.fn.init( selector, context );
	};
// 注意这里，fn是指向jQuery.prototype的另一个指针,只是让你写着方便而已
jQuery.fn = jQuery.prototype = {
	// jQuery当前版本
	jquery: version,
	// 修正构造器为jQuery
	constructor: jQuery,
	length: 0,
};
init = jQuery.fn.init = function( selector, context, root ) {
	// ...
	if ( !selector ) {
		return this;
	}
	// ...
};
// 把init的prototype也指向jQuery.prototype
init.prototype = jQuery.fn;
```

![image-20200720233121795](http://picbed.sedationh.cn/image-20200720233121795.png)



## extend函数 深度拷贝 类型判断

[JavaScript专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

[JavaScript专题之类型判断(下) ](https://github.com/mqyqingfeng/Blog/issues/30)

[avaScript专题之从零实现jQuery的extend](https://github.com/mqyqingfeng/Blog/issues/33)



> extend函数用于方便挂载方法和属性无论，内部和外部写插件都适用频繁

在进行deep copy的时候，我们需要对数据类型进行判断

### type API

仅仅使用`typeof`无法判断object和Function object的类型

| Type                                                         | Result                                                       |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined) | `"undefined"`                                                |
| [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null) | `"object"` (see [below](dfile:///Users/sedationh/Library/Application Support/Dash/DocSets/JavaScript/JavaScript.docset/Contents/Resources/Documents/developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof.html#null)) |
| [Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean) | `"boolean"`                                                  |
| [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number) | `"number"`                                                   |
| [BigInt](https://developer.mozilla.org/en-US/docs/Glossary/BigInt) (new in ECMAScript 2020) | `"bigint"`                                                   |
| [String](https://developer.mozilla.org/en-US/docs/Glossary/String) | `"string"`                                                   |
| [Symbol](https://developer.mozilla.org/en-US/docs/Glossary/Symbol) (new in ECMAScript 2015) | `"symbol"`                                                   |
| [Function](https://developer.mozilla.org/en-US/docs/Glossary/Function) object (implements [[Call]] in ECMA-262 terms) | `"function"`                                                 |
| Any other object                                             | `"object"`                                                   |

利用`Object.prototype.toString`可以方便的获取类型

```js
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]
// Since JavaScript 1.8.5
toString.call(undefined);   // [object Undefined]
toString.call(null);        // [object Null]
```



我们来利用这个特性创建type API方便我们查看类型

```js
var class2type = {};

// 生成class2type映射
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    // 一箭双雕 包含undefined & null的情况
    if (obj == null) {
        return obj + "";
    }
  	// 如果是基础数据类型就用typeof 否则利用创建的映射
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}
```



### isPlainObject

哪些情况is plain object?

1. new Objecy()
2. {}
3. Object.create(null) jQuery 认为一个没有原型的对象也是一个纯粹的对象

The `Object.create()` method creates a new object, using an existing object as the prototype of the newly created object.



```js
var class2type = {};

// 下面两个只是为了方便调用
// 相当于 Object.prototype.toString
var toString = class2type.toString;

// 相当于 Object.prototype.hasOwnProperty
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
    var proto, Ctor;

    // 排除掉明显不是obj的以及一些宿主对象如Window
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    /**
     * getPrototypeOf es5 方法，获取 obj 的原型
     * 以 new Object 创建的对象为例的话
     * obj.__proto__ === Object.prototype
     */
    proto = Object.getPrototypeOf(obj);

    // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
    if (!proto) {
        return true;
    }

    /**
     * 以下判断通过 new Object 方式创建的对象
     * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
     * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
     */
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;

    // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}
```

值得注意的是 hasOwn.toString调用的是函数实现的toString方法,相较于Object的toString方法

The [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) object overrides the [`toString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) method inherited from [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object); it does not inherit [`Object.prototype.toString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString). For user-defined [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) objects, the `toString` method returns a string containing the source text segment which was used to define the function.

JavaScript calls the `toString` method automatically when a [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) is to be represented as a text value, e.g. when a function is concatenated with a string.



有了上述准备，就可以开始写extend函数了



### extend

完整的实现和注释参看[deepjQ.js](deepjQ.js)



### noConflict

这个api 的场景是

先有其他使用$的library导入，再导入$

true的参数是用于处理多版本jQ共同使用的

```js
var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	// 如果已经存在$ === jQuery;
	// 把已存在的_$赋值给window.$;
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	// 如果deep为 true, 并且已经存在jQuery === jQuery;
	// 把已存在的_jQuery赋值给window.jQuery;
	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	// 最后返回jQuery
	return jQuery;
};
```