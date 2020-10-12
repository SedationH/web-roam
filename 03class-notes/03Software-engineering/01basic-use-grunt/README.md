## [基本使用](https://gruntjs.com/getting-started)

```zsh
yarn add grunt -D
```

创建`\Gruntfile.js` 

> 通过yarn grunt会在本地寻找这个文件，整个文件导出一个函数，函数可以接受一个形式参数，包含grunt所提供的API

执行注册的任务

```zsh
yarn grunt foo
```

这里的逻辑是在node_modules/.bin 中有相关指令 foo是task name

另外 省略task name 执行default默认任务

```
yarn grunt
```



值得注意的是，grunt默认全部都是同步任务，异步要用到this拿到的函数来成功执行

```js
// 异步任务 要用到this
grunt.registerTask('async', function () {
  const done = this.async()
  setTimeout(() => {
    console.log('execute async task')
    done()
  }, 1000);
})
```

