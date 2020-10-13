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

