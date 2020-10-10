# WebAPI：setTimeout是如何实现的？

## 设计

setTimeout执行任务是根据设定时间而不是加入顺序

原有消息队列先进先出的设计不适合setTimeout类似任务的执行



所以Chrome通过hashmap结构实现一个异步延迟队列,⚠️队列的说法只是为了统一表达

> 一个hashmap结构，等到执行这个结构的时候，会计算hashmap中的每个任务是否到期了，到期了就去执行，直到所有到期的任务都执行结束，才会进入下一轮循环。



```c++
DelayedIncomingQueue delayed_incoming_queue;
struct DelayTask{
  int64 id；
  CallBackFunction cbf;
  int start_time;
  int delay_time;
};
DelayTask timerTask;
timerTask.cbf = showName;
timerTask.start_time = getCurrentTime(); // 获取当前时间
timerTask.delay_time = 200;// 设置延迟执行时间
delayed_incoming_queue.push(timerTask); // 创建好回调任务，加入延迟执行队列

void ProcessTimerTask(){
  // 从 delayed_incoming_queue 中取出已经到期的定时器任务
  // 依次执行这些任务
}
 
TaskQueue task_queue；
void ProcessTask();
bool keep_running = true;
void MainTherad(){
  while(true){
    // 执行消息队列中的任务
    Task task = task_queue.takeTask();
    ProcessTask(task);
    
    // 执行延迟队列中的任务
    ProcessTimerTask()
}
```

在主线程循环中，不断进行查找due delay task & exe.



另外，提前终止setTimeout即把setTimeout返回的值拿到

```js
let timeId = setTimeout(() => {})
clearTimeout(timeId)
```

也就把相关事件从延迟执行队列中删去了



## 一些使用setTimeout的注意点

1. 设定时间为最理想值，会受到`ProcrssTask()`的影响

```js
function bar() {
    console.log('bar')
}
function foo() {
    setTimeout(bar, 0);
    for (let i = 0; i < 5000; i++) {
        let i = 5+8+8+8
        console.log(i)
    }
}
foo()
```

2. this

```js
var name= 1;
var MyObj = {
  name: 2,
  showName: function(){
    console.log(this.name);
  }
}
setTimeout(MyObj.showName,1000) // 1
```

最后一行相当于

```js
let tem = Myobj.showName
// 到时间的时候
tem()  -> // 1
// this仅和函数调用关系有关
```

Solution

1. bind
2. 放在匿名函数中通过对象调用

```js
setTimeout(() => {
  MyObj.showName()
})
setTimeout(MyObj.showName.bind(MyObj))
```

