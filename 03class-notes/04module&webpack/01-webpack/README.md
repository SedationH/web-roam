## 模块打包的由来

- ES 兼容问题
- 减少网络请求
- 除了JS以外的文件，也是资源，看作组成应用的模块



Solution: 

1. 支持除了js以外的文件进行打包
2. 新特性编译
3. 模块化JS打包



代码拆分 增量记载

资源模块

所有资源的模块化



## Use

一个简单的使用

webpack.config.js

```js
const path = require('path')

module.exports = {
  // 这个属性有三种取值，分别是 production、development 和 none。
  // 1. 生产模式下，Webpack 会自动优化打包结果；
  // 2. 开发模式下，Webpack 会自动优化打包速度，添加一些调试过程中的辅助；
  // 3. None 模式下，Webpack 就是运行最原始的打包，不做任何额外处理；
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  }
}
```



## 原理

在mode: none模式下查看一下webpack打包原理 [debug](./debug)

![image-20201025164935223](http://picbed.sedationh.cn/image-20201025164935223.png)

modules 是个数组，里面就是包含着模块的函数



r函数起到标记效果，表示这是一个esmodule

![image-20201025165339508](http://picbed.sedationh.cn/image-20201025165339508.png)



webpackBootStrap 就是用来处理依赖和标记的

这样就把所需的函数整合到了一起

以上的内容是webpeck 4 的版本... 5 变了

![image-20201025173637508](http://picbed.sedationh.cn/image-20201025173637508.png)

待我加入了css和file处理后 发现又和4一样了，先理解到这里吧



webpack内部只能处理js assets,别的资源需要各种loader进行实现

更详细的loader原理分析见[debug](./00debug-interpretation)



入口不仅仅可以是js文件，其他文件也可以

逻辑上是通过例如css-loader处理后，在通过style-loader进行js化，实际最终仍然为js



可以通过js的形式进行转化调用的，就转一下再加入dom树就好，如css的处理

不可以的，如下图的文件，就是复制和重定向的问题，还可以使用dataURL进行替代，base64编码等等



所以如果文件也使用（主要是二进制的表示问题）dataURLs进行转换，那么我们就可以使用js完成所有文件资源的表示了



file-loader

![image-20201025172922925](http://picbed.sedationh.cn/image-20201025172922925.png)





**js作驱动整个前端应用**

在js中根据需要动态导入 所需的资源

代码的工作需要特定的资源，因此直接在js文件中建立依赖关系

这样其实挺合理的，这样建立的依赖关系十分明确



## 使用注意

关于文件处理的最佳实践

小文件走dataURLs 减少请求  大文件走file-loader

因为文件太大还用dataURLs进行处理会导致js太大，拖慢运行



## loader

webpack就是一个资源整合器，js是整个整合器的核心，



- 编译转换类
  - css-loader
- 文件操作类
  - file-loader 文件复制 导出访问逻辑
- 代码检查
  - eslint-loader



## Webpack与ES6

webpack只是针对代码里的import & export进行处理，并没有进行对es6代码的转换

可以看到dist/bundle.js中const 等es6特性依然存在

想要处理 使用babel-loader 值得注意的是 babel也只是个平台，注意配置其plugins



## webpack 模块加载方式

- 遵循 ESM import
- CJS require
- AMD define require
- 样式文件中 @import url()
- html中的标签引用资源

webpack会引用相关的loader进行处理



整个工作流程来看，webpack拿到依赖树，对依赖树进行递归遍历，refer `webpack.config.js`中的设置的rules使用相应的loader进行处理



## plugins机制

Loader专注实现资源模块的加载

plugins解决一些除了资源加载外的需要自动化的工作

使用方式

webpack.config.js中

```js
const Xxx = require('xxx')

modules.exports = {
  plugins: [
    // 具体看插件导出啥 一般是类
    // 这就是 new Xxx({options: object})
    xxx
  ]
}
```



## 一些常用的plugins

- clean-webpack-plugin  常用于自动清理dist文件
- html-webpack-plugin

在00 和 01对webpack的使用中，指定webpack打包到dist/bundle.js中，

都是自己写好index,进行硬编码引入的

这样的方式在进行代码分割，生成多个js文件的时候，会很麻烦，而且在日后修改后，又需要再硬编码修改引用，所以更好的方式应该是让这个html在dist中自己生成

其实也就是查文档+配置

[参考下大致使用](./02use-plugins) 



## 实现自己的webpack plugins

先要理解webpack plugins的如何工作的

**Plugins通过钩子机制实现**

Webpack工作的过程中，有很多环节，webpack为这些向外界暴露钩子，外界可以利用钩子来实现对特定环节的逻辑处理

![image-20201026111457445](http://picbed.sedationh.cn/image-20201026111457445.png)



所以在添加plugins才没有强调顺序



[自己实现参考](./02use-plugins/webpack.config.js#L19) 

