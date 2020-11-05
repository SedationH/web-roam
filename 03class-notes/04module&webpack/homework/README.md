## 一

### Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

参考[CSDN](https://blog.csdn.net/qq_36380426/article/details/106894870)

1. 根据配置(shell | webpack.config.js)，设置构建的配置参数
2. 从指定的enrty文件开始，开始解析文件，根据配置转换文件
3. 输出处理后的文件



> 看完上面的构建流程的简单介绍，相信你已经简单了解了这个过程，那么接下来开始详细介绍 Webpack 构建原理，包括从启动构建到输出结果一系列过程：
>
> **（1）初始化参数**
>
> 解析 Webpack 配置参数，合并 Shell 传入和 `webpack.config.js` 文件配置的参数，形成最后的配置结果。
>
> **（2）开始编译**
>
> 上一步得到的参数初始化 `compiler` 对象，注册所有配置的插件，插件监听 Webpack 构建生命周期的事件节点，做出相应的反应，执行对象的 `run` 方法开始执行编译。
>
> **（3）确定入口**
>
> 从配置文件（ `webpack.config.js` ）中指定的 `entry` 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。
>
> **（4）编译模块**
>
> 递归中根据**文件类型**和 **loader** 配置，调用所有配置的 loader 对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
>
> **（5）完成模块编译并输出**
>
> 递归完后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据 `entry` 配置生成代码块 `chunk` 。
>
> **（6）输出完成**
>
> 输出所有的 `chunk` 到文件系统。
>
> 注意：在构建生命周期中有一系列插件在做合适的时机做合适事情，比如 `UglifyPlugin` 会在 loader 转换递归完对结果使用 `UglifyJs` 压缩**覆盖之前的结果**。

## Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

loader的使用与开发

```js
module: {
    rules: [
      {
        test: /.md$/,
        // use: ["./log-loader", "./markdown-loader"],
        use: "./markdown-loader",
      },
    ],
  },
```

```js
const marked = require("marked")

module.exports = (source) => {
  console.log(typeof source) //string
  const html = marked(source)
  return `export default ${JSON.stringify(html)}`
}

```

Plugins开发

配置

```js
plugins: [
    new MyPlugin()
  ],
```

```js
// 实现对于dist/bundle.js前面

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	//var __webpack_module_cache__ = {};
/******/ 	
/******/ 	/
// 内容的去除

class MyPlugin {

  // 要求plugins要么是一个函数，要么是一个包含apply方法的对象
  apply(compiler) {
    console.log("MyPlugin 启动")

    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name)
        // console.log(compilation.assets[name].source())
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(
            /\/\*\*+\*\//g,
            ""
          )
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          }
        }
      }
    })
  }
}
```

都是我们编写一个函数来处理

- loader param & return 都是字符串
- plugin 接受一个compiler对象，通过这个对象上提供额生命周期钩子，来达到我们的目的



任务

- loader更多的是在处理文本，进行代码或者资源的转换工作
- plugins的用途更广泛，通过hooks参与webpack构建的不同时间，主要目的是实现各种自动化工作



## 二

### 使用 Webpack 实现 Vue 项目打包任务

[Click](./vue-app-base)