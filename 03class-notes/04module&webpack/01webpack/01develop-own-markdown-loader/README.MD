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

值得注意的是，最后一个处理的loader要求返回符合js代码语法的string，这些string在最后的bundle.js中被用作代码执行



![image-20201025210658855](http://picbed.sedationh.cn/image-20201025210658855.png)