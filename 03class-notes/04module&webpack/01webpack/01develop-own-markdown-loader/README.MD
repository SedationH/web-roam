## Webpack的和核心loader的工作原理

处理逻辑与linux 下的pipe相似



```js
// 整个模块作为一个函数导出被使用
module.exports = (source) => {
  console.log(type source) // 一开始都是string 一般模块也都用string导出
  // 但这个是根据你的上一个loader具体返回啥来决定的，并不一定都是string,通过log-loader可以看看测试
  
  // TODO Logic
  
  // 返回给下一个loader
  return 
}

```

值得注意的是，最后一个处理的loader要求返回符合js代码语法的string，这些string在最后的bundle.js中被用作代码执行 via **eval**



![image-20201025210658855](http://picbed.sedationh.cn/image-20201025210658855.png)



```js
const marked = require("marked")

module.exports = (source) => {
  console.log(typeof source) //string
  const html = marked(source)
  return `export default ${JSON.stringify(html)}`
}
```

这里的JSON.stringify是干嘛的呢？

如果不使用的话

```js
ERROR in ./src/about.md 1:0
Module parse failed: Unexpected token (1:0)
File was processed with these loaders:
 * ./markdown-loader.js
You may need an additional loader to handle the result of these loaders.
> <h1 id="title">Title</h1>
| <p>I am SedationH</p>
| 
 @ ./src/index.js 1:0-30 3:15-20
```

使用的话呢？

```js
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<h1 id=\"title\">Title</h1>\n<p>I am SedationH</p>\n");
```

可知后者对可能出现的""符号进行了转义，在转换到webpack bundle中的代码不是es6，没有模版``的使用，文本中的" 可能与表示字符串的产生冲突

