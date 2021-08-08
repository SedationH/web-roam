## 什么是webpack？

> At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph which maps every module your project needs and generates one or more bundles.



通过理解不同JS文件间的依赖关系，形成打包文件的工具



模块化的核心

- 依赖处理

- 分割作用域



webpack的方案

- 自己实现一套 exports require 的逻辑来协调不同规范下的模块API
- 使用函数进行作用域分割(eval? 目前使用 source-map 的形式还没研究eval)



## 从一些例子🌰开始

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var target = 'var'

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'entry.js'),
  output: {
    clean: true,
    library: {
      name: 'MyLibrary',
      type: 'var',
    },
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: target,
      filename: 'index.html',
    }),
  ],
}
```



dist/index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>var</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"><script defer src="main.js"></script></head>
  <body>
  </body>
</html>
```



### 没有依赖

entry.js

```js
console.log(1)
```



main.js

```js
var MyLibrary;
/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************!*\
  !*** ./entry.js ***!
  \******************/
console.log(1)

console.log(2)
MyLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=main.js.map
```



### 开始有依赖了

```js
import { name, default as foo } from './foo'

console.log(1, name, foo)

export default 1
export const entry = 'this is entry'
const second = 'this is second'
export { second }


while (false) {}

export const name = 'foo name'

export default 'foo default'
```

```js
var MyLibrary;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./foo.js":
/*!****************!*\
  !*** ./foo.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
while (false) {}

const name = 'foo name'

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('foo default');


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./entry.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "entry": () => (/* binding */ entry),
/* harmony export */   "second": () => (/* binding */ second)
/* harmony export */ });
/* harmony import */ var _foo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foo */ "./foo.js");


console.log(1, _foo__WEBPACK_IMPORTED_MODULE_0__.name, _foo__WEBPACK_IMPORTED_MODULE_0__.default)

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (1);
const entry = 'this is entry'
const second = 'this is second'


})();

MyLibrary = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=main.js.map
```

分析思路如下

`__webpack_require__` 上面的几个方法

- d define 核心

- o Object.prototype.hasOwnProperty

- r  namespce



先看是咋用的

```js
export default 1
export const entry = 'this is entry'
const second = 'this is second'
export { second }
```



```js
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "entry": () => (/* binding */ entry),
/* harmony export */   "second": () => (/* binding */ second)
/* harmony export */ });
```



```js
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
```



去除缓冲 和 define  转换的等价代码

```js
var test;
(() => {
  var __webpack_modules__ = {
    "./foo.js": (__webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, {
        name: () => /* binding */ name,
        default: () => __WEBPACK_DEFAULT_EXPORT__,
      });

      while (false) {}

      const name = "foo name";

      const __WEBPACK_DEFAULT_EXPORT__ = "foo default";
    },
  };

  function __webpack_require__(moduleId) {
    var module = {
      exports: {},
    };
    __webpack_modules__[moduleId](module.exports, __webpack_require__);
    return module.exports;
  }

  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  const __webpack_exports__ = {};

  (() => {
    __webpack_require__.d(__webpack_exports__, {
      default: () => __WEBPACK_DEFAULT_EXPORT__,
      entry: () => entry,
      second: () => second,
    });

    var _foo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./foo.js");

    console.log(
      1,
      _foo__WEBPACK_IMPORTED_MODULE_0__.name,
      _foo__WEBPACK_IMPORTED_MODULE_0__.default
    );

    const __WEBPACK_DEFAULT_EXPORT__ = 1;
    const entry = "this is entry";
    const second = "this is second";
  })();

  test = __webpack_exports__;
})();

```



## 重点需要去理解的内容

https://webpack.js.org/concepts/ 几个核心概念

- entry
- output
- loader
  - webpack开箱支持JS、JSON(就是node支持的)，其他文件需要通过loader转成webpack可以理解的文件，可以添加到依赖图中。
  - 从HMR的角度来看，还提供了替换的规则
- plugins
  - 在更多环节添加钩子，影响构建过程和最终产物
- mode



module chunk bundle

`module`，`chunk` 和 `bundle` 其实就是同一份逻辑代码在不同转换场景下的取了三个名字

我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。



## 一些常用的配置

### [output.type](https://webpack.js.org/configuration/output/#outputlibrarytype)

里面有多种类型

Configure how the library will be exposed.

- Type: `string`

  Types included by default are `'var'`, `'module'`, `'assign'`, `'assign-properties'`, `'this'`, `'window'`, `'self'`, `'global'`, `'commonjs'`, `'commonjs2'`, `'commonjs-module'`, `'amd'`, `'amd-require'`, `'umd'`, `'umd2'`, `'jsonp'` and `'system'`, but others might be added by plugins.



特别提提下使用umd的时候出现的self

The `**Window.self**` read-only property returns the window itself, as a `WindowProxy`. It can be used with dot notation on a `window` object (that is, `window.self`) or standalone (`self`). The advantage of the standalone notation is that a similar notation exists for non-window contexts, such as in [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker). By using `self`, you can refer to the global scope in a way that will work not only in a window context (`self` will resolve to `window.self`) but also in a worker context (`self` will then resolve to [`WorkerGlobalScope.self`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self)).



### [filename](https://webpack.js.org/configuration/output/#outputfilename)

主要是这里https://webpack.js.org/configuration/output/#template-strings

从不同的level下提供不同的 template name

抽象程度从高到低

Compilation-level

Chunk-level

Module-level

File-level

url-level



### [devtool](https://webpack.js.org/configuration/devtool/)

这里涉及一些关键字

We expect a certain pattern when validate devtool name, pay attention and dont mix up the sequence of devtool string. The pattern is: `[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`.

eval 使用 eval 包裹代码

inline map文件作为DataURL嵌入

cheap 不包含列信息

module 包含loader





#### source-map原理

http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html

关键是形成两者间的映射关系





## 热更新原理

阅读并写代码调试体会

实践偏向

guide  https://webpack.js.org/guides/hot-module-replacement/

api https://webpack.js.org/api/hot-module-replacement/

思路偏向

how it work? https://webpack.js.org/concepts/hot-module-replacement/



有不同的视角来理解热更新

先整体理解热更新是在做什么事情

-> 不需要刷新浏览器，动态替换需要的内容



```js
import _ from 'lodash'
import printMe from './print.js'
import printMe2 from './print2'
import './style.css'

function component(fn) {
  const element = document.createElement('div')
  const btn = document.createElement('button')

  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  btn.innerHTML = 'Click me and check the console!'
  btn.onclick = fn

  element.appendChild(btn)

  return element
}

let c = component(printMe)
let c2 = component(printMe2)

document.body.appendChild(c)
document.body.appendChild(c2)

if (module.hot) {
  module.hot.accept('./print.js', function () {
    document.body.removeChild(c)
    c = component(printMe) // Re-render the "component" to update the click handler
    document.body.appendChild(c)
  })

  module.hot.accept('./print2', function () {
    document.body.removeChild(c2)
    c2 = component(printMe2) // Re-render the "component" to update the click handler
    document.body.appendChild(c2)
  })

  module.hot.accept(['./print.js', './print2.js'], function () {
    console.log('hah')
  })
}
```





### 从交互对象上来说

![image-20210726143432660](http://picbed.sedationh.cn/image-20210726143432660.png)



### 从Compiler的角度来说

产生出更新文件

- the updated menifest
- one or more thunks(or deleted flags)



### 从module的角度来说

> HMR is an opt-in feature that only affects modules containing HMR code. One example would be patching styling through the [`style-loader`](https://github.com/webpack-contrib/style-loader). In order for patching to work, the `style-loader` implements the HMR interface; when it receives an update through HMR, it replaces the old styles with the new ones.
>
> Similarly, when implementing the HMR interface in a module, you can describe what should happen when the module is updated. However, in most cases, it's not mandatory to write HMR code in every module. If a module has no HMR handlers, the update bubbles up. This means that a single handler can update a complete module tree. If a single module from the tree is updated, the entire set of dependencies is reloaded.
>
> See the [HMR API page](https://webpack.js.org/api/hot-module-replacement) for details on the `module.hot` interface.



两个重点

通过HMR提供的接口，loader可以完成一些替换任务



module之间是有依赖的，现假设

A -> B -> C -> D

D是依赖关系中的叶子



如果D进行了更新，会通知 C -> B -> A 进行更新

即如果其中没有`no HMR handlers` 就向上一层依赖冒泡



## loader手写思路

ast 寻找需要处理的内容

进行修改

返回修改过的内容



source

->  AST 修改

返回



## 需求

基础库分离 利用走cdn html-webpack-externals-plugin



处理css前缀 autoprefixer  根据 Can i use 的规则



利用 px2rem-loader 搞移动端



多页面程序  entry: glob.sync(path.join(__dirname, './src/*/index.js')), 