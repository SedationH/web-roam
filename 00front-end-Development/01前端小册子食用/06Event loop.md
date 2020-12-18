# Event loop

参考资料

[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

[MDN Concurrency model and the event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)

[带你彻底弄懂Event Loop](https://juejin.im/post/5b8f76675188255c7c653811)

[微任务、宏任务与Event-Loop](https://juejin.cn/post/6844903657264136200#heading-3)

[深入理解js事件循环机制（浏览器篇）](http://lynnelv.github.io/js-event-loop-browser)

⚠️ 以下语境均为浏览器环境(Nodejs的实现不同)

部分英文的使用是为了描述更加准确



## 来源

JS是单线程语言，单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。

如果排队是因为计算量大，CPU忙不过来，倒也算了，但是很多时候CPU是闲着的，因为IO设备（输入输出设备）很慢（比如Ajax操作从网络读取数据），不得不等着结果出来，再往下执行。

JavaScript语言的设计者意识到，这时主线程完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去。



## 任务分类

我们写代码就是让js去执行任务，所有的任务分成两种

1. 同步任务（synchronous）
2. 异步任务（asynchronous）





同步任务在主线程上正常执行

而异步任务需要 message queue的配合

The **event loop** got its name because of how it's usually implemented, which usually resembles:

```js
while (queue.waitForMessage()) {
  queue.processNextMessage()
}
```

从message queue中不断读取message，进行处理 这一过程就是Event loop



## message

message是怎么产生的呢？

ans：

- IO/WebAPI中通过回调函数(setTimeout,Promise.then()...)
- 为事件绑定回调函数



![image-20200520165543047](http://picbed.sedationh.cn/image-20200520165543047.png)



## message queue中的门道

[微任务、宏任务](https://juejin.im/post/5b73d7a6518825610072b42b)

执行完主线程的所有任务后，才开始执行message queue中的callback

而message queue并不只有一个

⚠️ 都是指相关的回调函数 [动画讲解十分清晰](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/#level-1-bossfight)



1. macrotask
   1. setTimeout
   2. setInterval
   3. setImmediate 
   4. requestAnimationFrame 
   5. I/O
2. microtask
   1. Promise.then catch finally
   2. MutationObserver
   3. process.nextTick(NodeJS的)



执行是有差异的，在执行macrotask前,必须清空microtask

注意执行macrotask时可能产生了microtask，也要先清空再搞别的macrotask



## 测试一下

```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
})

setTimeout(() => {
  console.log(6);
})

console.log(7);

```

```
// 正确答案
1
4
7
5
2
3
6
```

[分析参看](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/#level-1-bossfight)