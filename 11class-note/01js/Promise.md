## 前置知识

JS单线程指JS执行JS代码是单线程进行

JS能够调用一些环境所提供的api，这些api是可能是异步的，如`setTimeout`

可以通过下面这个模型思考其间的关系

![image-20200922105858303](http://picbed.sedationh.cn/image-20200922105858303.png)

WebAPi中所维护的计时器和JS线程的执行屁不想干，timer1计时结束，进入Queue

- Call stack是当前js运行的调用表
- Queue是等待进入Call Stack的等待表
- 只有Call stack为空 才去查看Queue中是否有需要执行的任务，进行执行

回调函数是JS实现异步的基础

对于一个异步任务，我们不知道它会何时结束，我们于是规定它在结束的时候做什么，从而完成规定时序的效果

在计算机世界中，同步并不是指同时执行，而是在强调有执行的固定时序

并发也不是说一起运行，而是在宏观上表现为一个时间段一起运行



## Promise

Promise在回调函数的基础上进行封装，是一种更优的异步统一方案

关于Promise的状态转移图

```mermaid
graph TD
  A[Promise] -->|Pending| B[Fulfilled]
  A[Promise] -->|Pending| C[Rejected]
  B --> D[onFulfilled]
  C --> E[onRejected]
```



```js
// resolve 和 reject的处理结果对应当前Promise状态的Fulfilled & Rejected
new Promise((resolve, reject) => {
  // 没有执行 resolve | reject的时候是pending
  setTimeout(() => {
    resolve(1)
  }, 200)
}).then(
  function onfulfiled(result) {
    console.log(result)
  },
  function onRejected(err) {
    console.log(err)
  }
)
```

通过then产生的回调是一种micro-task 当前call stack中的函数执行完成后，优先检查执行micro-queue中的任务

也就是说类似setTimeout所产生的回调，进入queue等待队列，想要执行，需要call stack & micro 都为空的时候，才能轮到queue



Promise还有一些特性与方法，异常穿透，链式调用，一些常用的静态方法all race ...

这些尝试写一遍源码就行了

## 生成器函数 Generate

