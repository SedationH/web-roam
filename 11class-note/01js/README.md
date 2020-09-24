## 总览

JS是整个前端的核心，理清JS的运行机制很重要



JS代码由JS引擎进行解释执行，常见的JS引擎有：

- Chrome V8引擎 (chrome、Node、Opera）
- SpiderMonkey （Firefox）
- Nitro (Safari）
- Chakra （Edge）



JS引擎工作在宿主环境中，可以使用宿主环境所暴露的API，常见的宿主环境(runtime)

- node
- 浏览器

| 宿主环境 | JS引擎        | 运行时特性                             |
| -------- | ------------- | -------------------------------------- |
| 浏览器   | chrome V8引擎 | DOM、 window对象、用户事件、Timers等   |
| node.js  | chrome V8引擎 | require对象、 Buffer、Processes、fs 等 |



JS是单线程执行的，但是runtime暴露出的一些方法，在其自身的runtime中，是不算到JS线程之中的,比如http请求线程，事件处理线程，定时器处理线程



Queue 提供“代办事项”的处理队列 runtime相关线程的任务执行完，就把回调函数加入Queue中

Event Loop 在主线程空闲的时候，将Queue中的"待办事项" | 回调函数 取出进行执行



为了更加高效的处理WebAPI之中的异步逻辑，引入了微任务和宏任务

微任务的处理优先级大于宏任务的处理优先级

**macrotasks:** [setTimeout](https://developer.mozilla.org/docs/Web/API/WindowTimers/setTimeout), [setInterval](https://developer.mozilla.org/docs/Web/API/WindowTimers/setInterval), [setImmediate](https://developer.mozilla.org/docs/Web/API/Window/setImmediate), [requestAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame), [I/O](https://developer.mozilla.org/docs/Mozilla/Projects/NSPR/Reference/I_O_Functions), UI rendering
**microtasks:** [process.nextTick](https://nodejs.org/uk/docs/guides/event-loop-timers-and-nexttick/), [Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), [queueMicrotask](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask), [MutationObserver](https://developer.mozilla.org/docs/Web/API/MutationObserver)



总的来看 function stack > microtasks > macrotasks

都是在前者没了的时候才进行取出调用

