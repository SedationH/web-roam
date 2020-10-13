## 关于exports

```js
// 用于导出的文件 其module实现相当于
let module = {
  exports: {

  }
}
let exports = module.exports

// 使用导出的文件 其引入相当于
const a = require('some-module')
// <=>
const a = module.exports
```



## [Gulp](https://gulpjs.com/docs/en/getting-started/creating-tasks)

见[gulpfile.js](./gulpfile.js)文件 有grunt的基础，这里就知道是在干嘛了



提一点，默认都视作做异步任务

> Each gulp task is an asynchronous JavaScript function that either accepts an error-first callback or returns a stream, promise, event emitter, child process, or observable. Due to some platform limitations, synchronous tasks aren't supported.



[这里好好看一下](https://gulpjs.com/docs/en/api/concepts)

[globs](https://gulpjs.com/docs/en/getting-started/explaining-globs/)

