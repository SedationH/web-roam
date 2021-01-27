# WebAPI：XMLHttpRequest是怎么实现的？

XMLHttpRequest为JS提供了从Web服务器获取数据的能力

我们知道消息队列+时间循环机制让页面有条不紊的执行，具体到每一个任务上，都有一个系统调用栈用于维护任务的执行

## 系统调用栈

当循环系统在执行一个任务的时候，都要为这个任务维护一个**系统调用栈**。这个**系统调用栈**类似于 JavaScript 的调用栈，只不过系统调用栈是 Chromium 的开发语言 C++ 来维护的。

![image-20200531113231562](http://picbed.sedationh.cn/image-20200531113231562.png)

这幅图记录了一个 Parse HTML 的任务执行过程，其中黄色的条目表示执行 JavaScript 的过程，其他颜色的条目表示浏览器内部系统的执行过程。

通过该图你可以看出来，Parse HTML 任务在执行过程中会遇到一系列的子过程，比如在解析页面的过程中遇到了 JavaScript 脚本，那么就暂停解析过程去执行该脚本，等执行完成之后，再恢复解析过程。然后又遇到了样式表，这时候又开始解析样式表……直到整个任务执行完成。

需要说明的是，整个 Parse HTML 是一个完整的任务，在执行过程中的脚本解析、样式表解析都是该任务的子过程，其下拉的长条就是执行过程中调用栈的信息。





补一下15留下的坑 - *什么是回调函数*

## 回调函数

> 将一个函数作为参数传递给另外一个函数，那作为参数的这个函数就是**回调函数**。



```js
let callback = function(){
  console.log('I am callback function')
}
function invoke(callback){
  callback()
  console.log('over')
}
invoke(callback)
// i am
// over
```

以上的情况为同步回调，callback执行在调用函数(invoke)的调用栈中

![image-20200531112910988](http://picbed.sedationh.cn/image-20200531112910988.png)

```js
let callback = function(){
  console.log('I am callback function')
}
function invoke(callback){
  setTimeout(() => {
    callback()
  })
  console.log('over')
}
invoke(callback)
// over
// i am
```

![image-20200531112905601](http://picbed.sedationh.cn/image-20200531112905601.png)



## XMLHttpRequest

![image-20200531114409281](http://picbed.sedationh.cn/image-20200531114409281.png)

随便找个API来测试

```js
let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      switch (xhr.readyState) {
        case 0: // 请求未初始化
          console.log(" 请求未初始化 ")
          break;
        case 1://OPENED
          console.log("OPENED")
          break;
        case 2://HEADERS_RECEIVED
          console.log("HEADERS_RECEIVED")
          break;
        case 3://LOADING  
          console.log("LOADING")
          break;
        case 4://DONE
          if (this.status == 200 || this.status == 304) {
            console.log(this.responseText);
          }
          console.log("DONE")
          break;
      }
    }
    xhr.ontimeout = function(e) { console.log('ontimeout') }
    xhr.onerror = function(e) { console.log('onerror') }
    xhr.open('GET','https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=2',true)
    xhr.send()

```

![image-20200531120027722](http://picbed.sedationh.cn/image-20200531120027722.png)

![image-20200531115617641](http://picbed.sedationh.cn/image-20200531115617641.png)

![image-20200531115756437](http://picbed.sedationh.cn/image-20200531115756437.png)

具体还是去打开dev看网络和performance吧



大致流程

渲染引擎 执行代码 网络请求发给网络进程 期间一些状态通过回调函数进行监测

也就是说 网络进程的执行状态，通过将回调函数加入消息队列并通过循环机制进行执行来显示。

## 对比

对比来看，setTimeout通过把任务添加到延迟队列再配合循环机制来实现，XMLHttpRequest通过渲染进程和其他进程（网络）相互配合 -> 回调函数+消息队列+时间循环机制 配合实现



## 关于XMLHttpRequest的一些坑

都是浏览器安全策略造成的

### 跨域

跨域不允许

### HTTPS混合内容

HTTPS 混合内容是 HTTPS 页面中包含了不符合 HTTPS 安全要求的内容，比如包含了 HTTP 资源，通过 HTTP 加载的图像、视频、样式表、脚本等，都属于混合内容。

通常，如果 HTTPS 请求页面中使用混合内容，浏览器会针对 HTTPS 混合内容显示警告，用来向用户表明此 HTTPS 页面包含不安全的资源。

通过 HTML 文件加载的混合资源，虽然给出警告，但大部分类型还是能加载的。而使用 XMLHttpRequest 请求时，浏览器认为这种请求可能是攻击者发起的，会阻止此类危险的请求。

![image-20200531121124008](http://picbed.sedationh.cn/image-20200531121124008.png)

